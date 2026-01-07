// Lazy initializer for PrismaClient to avoid crash at module-import time
let _prisma = null;

function getPrisma() {
  if (_prisma) return _prisma;
  try {
    const { PrismaClient } = require('@prisma/client');
    _prisma = new PrismaClient();
    return _prisma;
  } catch (err) {
    console.error('[Prisma] initialization failed:', err && err.message ? err.message : err);
    return null;
  }
}

module.exports = { getPrisma };
