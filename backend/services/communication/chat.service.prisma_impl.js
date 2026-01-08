const responseStatus = require("../../handlers/responseStatus.handler.js");

function notSupported(res, action = "This action") {
  return responseStatus(res, 501, false, null, `${action} is not supported in Prisma mode yet.`);
}

async function createConversationService(_body, _userId, _userModel, res) {
  return notSupported(res, "Conversation creation");
}

async function getConversationsService(_userId, _userModel, _schoolId) {
  // Controller wraps this with responseStatus already.
  return [];
}

async function getConversationService(_conversationId, _userId, _limit) {
  return null;
}

async function sendMessageService(_body, _conversationId, _userId, _userModel, _schoolId, res) {
  return notSupported(res, "Sending messages");
}

async function addParticipantsService(_conversationId, _participants, _userId, res) {
  return notSupported(res, "Adding participants");
}

async function removeParticipantService(_conversationId, _participantId, _userId, res) {
  return notSupported(res, "Removing participants");
}

async function deleteMessageService(_conversationId, _messageId, _userId, res) {
  return notSupported(res, "Deleting messages");
}

async function deleteConversationService(_conversationId, _userId, res) {
  return notSupported(res, "Deleting conversations");
}

async function markMessagesReadService(_conversationId, _userId, res) {
  return notSupported(res, "Marking messages read");
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
