const app = require("./app/app");
const dbConnect = require("./config/dbConnect");

// Ensure Prisma is initialized on cold start
let prismaInitialized = false;

module.exports = async (req, res) => {
	try {
		// Auto-enable Prisma mode on Vercel if DATABASE_URL is set
		if (process.env.VERCEL && process.env.DATABASE_URL && !process.env.USE_PRISMA) {
			process.env.USE_PRISMA = 'true';
		}

		// Initialize Prisma connection once on cold start
		if (!prismaInitialized && (process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1')) {
			try {
				const { getPrisma } = require('./lib/prismaClient');
				const prisma = getPrisma();
				if (prisma) {
					// Test the connection
					await prisma.$connect();
					console.log('[Vercel] Prisma connection established');
					prismaInitialized = true;
				}
			} catch (prismaErr) {
				console.error('[Vercel] Prisma connection failed:', prismaErr.message);
			}
		}

		// Ensure DB is connected before handling any request (for Mongoose)
		// Without this, first requests can fail with:
		// "Cannot call <model>.findOne() before initial connect()" when bufferCommands=false.
		await dbConnect();
	} catch (err) {
		console.error('[Vercel] Database initialization error:', err.message);
		res.statusCode = 500;
		res.setHeader("Content-Type", "application/json");
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.end(
			JSON.stringify({
				success: false,
				data: null,
				message: err?.message || "Database connection failed",
				details: process.env.NODE_ENV === 'development' ? err.stack : undefined
			})
		);
		return;
	}

	return app(req, res);
};
