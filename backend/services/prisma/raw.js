const crypto = require("crypto");
const { getPrisma } = require("../../lib/prismaClient");

const ensuredKeys = new Set();

function uuid() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // Fallback for older Node
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16)
  );
}

function getPrismaOrThrow() {
  const prisma = getPrisma();
  if (!prisma) {
    const err = new Error("Prisma client is not available");
    err.code = "PRISMA_UNAVAILABLE";
    throw err;
  }
  return prisma;
}

async function ensureOnce(key, ensureFn) {
  if (ensuredKeys.has(key)) return;
  await ensureFn();
  ensuredKeys.add(key);
}

async function exec(prisma, sql, ...params) {
  return prisma.$executeRawUnsafe(sql, ...params);
}

async function query(prisma, sql, ...params) {
  return prisma.$queryRawUnsafe(sql, ...params);
}

module.exports = {
  uuid,
  getPrismaOrThrow,
  ensureOnce,
  exec,
  query,
};
