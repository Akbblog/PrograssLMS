// Lazy initializer for PrismaClient to avoid crash at module-import time
let _prisma = null;

function getPrisma() {
  if (_prisma) return _prisma;
  try {
    console.log('[Prisma] Initializing PrismaClient...');
    const { PrismaClient } = require('@prisma/client');
    _prisma = new PrismaClient();
    console.log('[Prisma] ✅ PrismaClient initialized successfully');
    return _prisma;
  } catch (err) {
    console.error('[Prisma] ❌ initialization failed:', err && err.message ? err.message : err);
    console.error('[Prisma] Stack:', err?.stack);
    return null;
  }
}

module.exports = { getPrisma };
