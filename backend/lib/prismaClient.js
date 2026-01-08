// Lazy initializer for PrismaClient to avoid crash at module-import time
let _prisma = null;
let _connectionAttempted = false;

function getPrisma() {
  if (_prisma) return _prisma;
  
  // Don't try if we already failed once (avoids repeated errors)
  if (_connectionAttempted && !_prisma) {
    console.log('[Prisma] Previous initialization failed, skipping retry');
    return null;
  }
  
  _connectionAttempted = true;
  
  try {
    console.log('[Prisma] Initializing PrismaClient...');
    console.log('[Prisma] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('[Prisma] USE_PRISMA:', process.env.USE_PRISMA);
    
    const { PrismaClient } = require('@prisma/client');
    _prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
    
    console.log('[Prisma] ✅ PrismaClient initialized successfully');
    return _prisma;
  } catch (err) {
    console.error('[Prisma] ❌ initialization failed:', err && err.message ? err.message : err);
    console.error('[Prisma] Stack:', err?.stack);
    
    // Check for common errors
    if (err.message && err.message.includes('prisma generate')) {
      console.error('[Prisma] Run "npx prisma generate" to generate the Prisma Client');
    }
    if (err.message && err.message.includes('DATABASE_URL')) {
      console.error('[Prisma] DATABASE_URL environment variable is not set');
    }
    
    return null;
  }
}

// Helper function to safely disconnect Prisma
async function disconnectPrisma() {
  if (_prisma) {
    try {
      await _prisma.$disconnect();
      console.log('[Prisma] Disconnected successfully');
    } catch (err) {
      console.error('[Prisma] Error disconnecting:', err.message);
    }
    _prisma = null;
    _connectionAttempted = false;
  }
}

module.exports = { getPrisma, disconnectPrisma };
