const responseStatus = require("../../handlers/responseStatus.handler.js");
const { getPrismaOrThrow, ensureOnce, exec, query, uuid } = require("../prisma/raw");

async function ensureChatTables(prisma) {
  await ensureOnce("chat_tables_v1", async () => {
    await exec(
      prisma,
      `CREATE TABLE IF NOT EXISTS communication_conversations (
        id VARCHAR(36) PRIMARY KEY,
        schoolId VARCHAR(36) NOT NULL,
        type VARCHAR(20) NOT NULL,
        name VARCHAR(255) NULL,
        description TEXT NULL,
        createdById VARCHAR(36) NOT NULL,
        createdByModel VARCHAR(20) NOT NULL,
        settings JSON NULL,
        isActive TINYINT(1) NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_school (schoolId),
        INDEX idx_updated (updatedAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    );

    await exec(
      prisma,
      `CREATE TABLE IF NOT EXISTS communication_participants (
        id VARCHAR(36) PRIMARY KEY,
        conversationId VARCHAR(36) NOT NULL,
        userId VARCHAR(36) NOT NULL,
        userModel VARCHAR(20) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'member',
        canSendMessages TINYINT(1) NOT NULL DEFAULT 1,
        joinedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_participant (conversationId, userId, userModel),
        INDEX idx_user (userId),
        INDEX idx_conv (conversationId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    );

    await exec(
      prisma,
      `CREATE TABLE IF NOT EXISTS communication_messages (
        id VARCHAR(36) PRIMARY KEY,
        conversationId VARCHAR(36) NOT NULL,
        senderId VARCHAR(36) NOT NULL,
        senderModel VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        messageType VARCHAR(50) NOT NULL DEFAULT 'text',
        attachments JSON NULL,
        replyToId VARCHAR(36) NULL,
        isDeleted TINYINT(1) NOT NULL DEFAULT 0,
        schoolId VARCHAR(36) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_conv_created (conversationId, createdAt),
        INDEX idx_school (schoolId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    );
  });
}

async function getSchoolIdForUser(prisma, userId, userModel) {
  if (userModel === "Admin") {
    const admin = await prisma.admin.findUnique({ where: { id: userId }, select: { schoolId: true } });
    return admin?.schoolId || null;
  }
  const teacher = await prisma.teacher.findUnique({ where: { id: userId }, select: { schoolId: true } });
  return teacher?.schoolId || null;
}

async function hydrateUser(prisma, userId, userModel) {
  if (userModel === "Admin") {
    const admin = await prisma.admin.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, avatar: true } });
    if (!admin) return null;
    return { _id: admin.id, name: admin.name, email: admin.email, avatar: admin.avatar };
  }
  if (userModel === "Teacher") {
    const teacher = await prisma.teacher.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, avatar: true } });
    if (!teacher) return null;
    return { _id: teacher.id, name: teacher.name, email: teacher.email, avatar: teacher.avatar };
  }
  if (userModel === "Student") {
    const student = await prisma.student.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, avatar: true } });
    if (!student) return null;
    return { _id: student.id, name: student.name, email: student.email, avatar: student.avatar };
  }
  return null;
}

async function createConversationService(body, userId, userModel, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureChatTables(prisma);

    const schoolId = await getSchoolIdForUser(prisma, userId, userModel);
    if (!schoolId) {
      return responseStatus(res, 400, "failed", "No school associated with this user");
    }

    const type = body?.type || "group";
    const name = body?.name || null;
    const description = body?.description || null;
    const settings = body?.settings || {};

    const conversationId = uuid();

    await exec(
      prisma,
      `INSERT INTO communication_conversations (id, schoolId, type, name, description, createdById, createdByModel, settings, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      conversationId,
      schoolId,
      type,
      name,
      description,
      userId,
      userModel,
      JSON.stringify(settings)
    );

    const participants = Array.isArray(body?.participants) ? body.participants : [];
    const finalParticipants = [
      { user: userId, userModel, role: "owner", canSendMessages: true },
      ...participants
        .filter((p) => p && p.user && p.user !== userId)
        .map((p) => ({
          user: p.user,
          userModel: p.userModel || "Teacher",
          role: p.role || "member",
          canSendMessages: p.canSendMessages !== false,
        })),
    ];

    for (const p of finalParticipants) {
      await exec(
        prisma,
        `INSERT IGNORE INTO communication_participants (id, conversationId, userId, userModel, role, canSendMessages)
         VALUES (?, ?, ?, ?, ?, ?)`,
        uuid(),
        conversationId,
        p.user,
        p.userModel,
        p.role,
        p.canSendMessages ? 1 : 0
      );
    }

    // Hydrate participants for a nicer response
    const participantRows = await query(
      prisma,
      `SELECT userId, userModel, role, canSendMessages FROM communication_participants WHERE conversationId = ?`,
      conversationId
    );

    const hydratedParticipants = [];
    for (const row of participantRows) {
      const user = await hydrateUser(prisma, row.userId, row.userModel);
      hydratedParticipants.push({
        user: user ? user : { _id: row.userId },
        userModel: row.userModel,
        role: row.role,
        canSendMessages: !!row.canSendMessages,
      });
    }

    const conversation = {
      _id: conversationId,
      schoolId,
      type,
      name,
      description,
      participants: hydratedParticipants,
      createdBy: userId,
      createdByModel: userModel,
      settings,
      isActive: true,
    };

    return responseStatus(res, 201, "success", conversation);
  } catch (err) {
    console.error("[Prisma chat] createConversationService error:", err);
    return responseStatus(res, 400, "failed", err.message);
  }
}

async function getConversationsService(userId, _userModel, schoolId) {
  const prisma = getPrismaOrThrow();
  await ensureChatTables(prisma);

  const rows = await query(
    prisma,
    `SELECT c.*
     FROM communication_conversations c
     INNER JOIN communication_participants p ON p.conversationId = c.id
     WHERE c.schoolId = ? AND c.isActive = 1 AND p.userId = ?
     ORDER BY c.updatedAt DESC`,
    schoolId,
    userId
  );

  // Attach participants (ids + basic profile)
  const conversations = [];
  for (const c of rows) {
    const participants = await query(
      prisma,
      `SELECT userId, userModel, role, canSendMessages FROM communication_participants WHERE conversationId = ?`,
      c.id
    );
    const hydratedParticipants = [];
    for (const p of participants) {
      const user = await hydrateUser(prisma, p.userId, p.userModel);
      hydratedParticipants.push({
        user: user ? user : { _id: p.userId },
        userModel: p.userModel,
        role: p.role,
        canSendMessages: !!p.canSendMessages,
      });
    }

    conversations.push({
      _id: c.id,
      schoolId: c.schoolId,
      type: c.type,
      name: c.name,
      description: c.description,
      participants: hydratedParticipants,
      createdBy: c.createdById,
      createdByModel: c.createdByModel,
      settings: c.settings ? JSON.parse(c.settings) : {},
      isActive: !!c.isActive,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    });
  }

  return conversations;
}

async function getConversationService(conversationId, userId, limit = 50) {
  const prisma = getPrismaOrThrow();
  await ensureChatTables(prisma);

  const [conv] = await query(prisma, `SELECT * FROM communication_conversations WHERE id = ? AND isActive = 1`, conversationId);
  if (!conv) return null;

  // Ensure user is participant
  const [membership] = await query(
    prisma,
    `SELECT id FROM communication_participants WHERE conversationId = ? AND userId = ? LIMIT 1`,
    conversationId,
    userId
  );
  if (!membership) return null;

  const participants = await query(
    prisma,
    `SELECT userId, userModel, role, canSendMessages FROM communication_participants WHERE conversationId = ?`,
    conversationId
  );

  const hydratedParticipants = [];
  for (const p of participants) {
    const user = await hydrateUser(prisma, p.userId, p.userModel);
    hydratedParticipants.push({
      user: user ? user : { _id: p.userId },
      userModel: p.userModel,
      role: p.role,
      canSendMessages: !!p.canSendMessages,
    });
  }

  const messageRows = await query(
    prisma,
    `SELECT * FROM communication_messages WHERE conversationId = ? AND isDeleted = 0 ORDER BY createdAt DESC LIMIT ?`,
    conversationId,
    limit
  );

  const messages = [];
  for (const m of messageRows.reverse()) {
    const sender = await hydrateUser(prisma, m.senderId, m.senderModel);
    messages.push({
      _id: m.id,
      conversation: m.conversationId,
      sender: sender ? sender : { _id: m.senderId },
      senderModel: m.senderModel,
      content: m.content,
      messageType: m.messageType,
      attachments: m.attachments ? JSON.parse(m.attachments) : [],
      replyTo: m.replyToId,
      isDeleted: !!m.isDeleted,
      createdAt: m.createdAt,
    });
  }

  return {
    conversation: {
      _id: conv.id,
      schoolId: conv.schoolId,
      type: conv.type,
      name: conv.name,
      description: conv.description,
      participants: hydratedParticipants,
      createdBy: conv.createdById,
      createdByModel: conv.createdByModel,
      settings: conv.settings ? JSON.parse(conv.settings) : {},
      isActive: !!conv.isActive,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    },
    messages,
  };
}

async function sendMessageService(body, conversationId, userId, userModel, schoolId, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureChatTables(prisma);

    const content = (body?.content || "").toString();
    if (!content.trim()) {
      return responseStatus(res, 400, "failed", "Message content is required");
    }

    // Ensure user is participant
    const [membership] = await query(
      prisma,
      `SELECT canSendMessages FROM communication_participants WHERE conversationId = ? AND userId = ? LIMIT 1`,
      conversationId,
      userId
    );
    if (!membership) {
      return responseStatus(res, 403, "failed", "You are not a participant in this conversation");
    }
    if (!membership.canSendMessages) {
      return responseStatus(res, 403, "failed", "You cannot send messages in this conversation");
    }

    const messageId = uuid();
    const messageType = body?.messageType || "text";
    const attachments = body?.attachments || [];
    const replyToId = body?.replyTo || null;

    await exec(
      prisma,
      `INSERT INTO communication_messages (id, conversationId, senderId, senderModel, content, messageType, attachments, replyToId, isDeleted, schoolId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      messageId,
      conversationId,
      userId,
      userModel,
      content,
      messageType,
      JSON.stringify(attachments),
      replyToId,
      schoolId
    );

    // bump updatedAt
    await exec(prisma, `UPDATE communication_conversations SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, conversationId);

    return responseStatus(res, 201, "success", {
      _id: messageId,
      conversation: conversationId,
      sender: { _id: userId },
      senderModel: userModel,
      content,
      messageType,
      attachments,
      replyTo: replyToId,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[Prisma chat] sendMessageService error:", err);
    return responseStatus(res, 400, "failed", err.message);
  }
}

async function addParticipantsService(conversationId, participants, userId, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureChatTables(prisma);

    // Only owner can add
    const [owner] = await query(
      prisma,
      `SELECT role FROM communication_participants WHERE conversationId = ? AND userId = ? LIMIT 1`,
      conversationId,
      userId
    );
    if (!owner || owner.role !== "owner") {
      return responseStatus(res, 403, "failed", "Only the conversation owner can add participants");
    }

    const list = Array.isArray(participants) ? participants : [];
    for (const p of list) {
      if (!p || !p.user) continue;
      await exec(
        prisma,
        `INSERT IGNORE INTO communication_participants (id, conversationId, userId, userModel, role, canSendMessages)
         VALUES (?, ?, ?, ?, ?, ?)`,
        uuid(),
        conversationId,
        p.user,
        p.userModel || "Teacher",
        p.role || "member",
        p.canSendMessages !== false ? 1 : 0
      );
    }

    await exec(prisma, `UPDATE communication_conversations SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, conversationId);
    return responseStatus(res, 200, "success", { message: "Participants added" });
  } catch (err) {
    console.error("[Prisma chat] addParticipantsService error:", err);
    return responseStatus(res, 400, "failed", err.message);
  }
}

async function removeParticipantService(conversationId, participantId, userId, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureChatTables(prisma);

    const [owner] = await query(
      prisma,
      `SELECT role FROM communication_participants WHERE conversationId = ? AND userId = ? LIMIT 1`,
      conversationId,
      userId
    );
    if (!owner || owner.role !== "owner") {
      return responseStatus(res, 403, "failed", "Only the conversation owner can remove participants");
    }

    await exec(
      prisma,
      `DELETE FROM communication_participants WHERE conversationId = ? AND id = ?`,
      conversationId,
      participantId
    );
    await exec(prisma, `UPDATE communication_conversations SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, conversationId);
    return responseStatus(res, 200, "success", { message: "Participant removed" });
  } catch (err) {
    console.error("[Prisma chat] removeParticipantService error:", err);
    return responseStatus(res, 400, "failed", err.message);
  }
}

async function deleteMessageService(conversationId, messageId, userId, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureChatTables(prisma);

    // Only sender can delete
    const [m] = await query(
      prisma,
      `SELECT senderId FROM communication_messages WHERE id = ? AND conversationId = ? LIMIT 1`,
      messageId,
      conversationId
    );
    if (!m) return responseStatus(res, 404, "failed", "Message not found");
    if (m.senderId !== userId) return responseStatus(res, 403, "failed", "Not allowed");

    await exec(prisma, `UPDATE communication_messages SET isDeleted = 1 WHERE id = ?`, messageId);
    return responseStatus(res, 200, "success", { message: "Message deleted" });
  } catch (err) {
    console.error("[Prisma chat] deleteMessageService error:", err);
    return responseStatus(res, 400, "failed", err.message);
  }
}

async function deleteConversationService(conversationId, userId, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureChatTables(prisma);

    const [owner] = await query(
      prisma,
      `SELECT role FROM communication_participants WHERE conversationId = ? AND userId = ? LIMIT 1`,
      conversationId,
      userId
    );
    if (!owner || owner.role !== "owner") {
      return responseStatus(res, 403, "failed", "Only the conversation owner can delete this conversation");
    }

    await exec(prisma, `UPDATE communication_conversations SET isActive = 0 WHERE id = ?`, conversationId);
    return responseStatus(res, 200, "success", { message: "Conversation deleted" });
  } catch (err) {
    console.error("[Prisma chat] deleteConversationService error:", err);
    return responseStatus(res, 400, "failed", err.message);
  }
}

async function markMessagesReadService(conversationId, userId, userModel) {
  // Prisma implementation currently doesn't maintain per-message read receipts in SQL schema.
  // Keep API stable: return a success object and let the controller send the HTTP response.
  try {
    // TODO: implement per-user read receipts when schema supports it.
    return { success: true };
  } catch (err) {
    console.error("[Prisma chat] markMessagesReadService error:", err);
    throw err;
  }
}

async function searchMessagesService(_query, _userId, _userModel, _schoolId) {
  return [];
}

module.exports = {
  createConversationService,
  getConversationsService,
  getConversationService,
  sendMessageService,
  addParticipantsService,
  removeParticipantService,
  deleteMessageService,
  deleteConversationService,
  markMessagesReadService,
  searchMessagesService,
};
