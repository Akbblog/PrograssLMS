const app = require("./app/app");
const dbConnect = require("./config/dbConnect");

module.exports = async (req, res) => {
	try {
		// Ensure DB is connected before handling any request.
		// Without this, first requests can fail with:
		// "Cannot call <model>.findOne() before initial connect()" when bufferCommands=false.
		await dbConnect();
	} catch (err) {
		res.statusCode = 500;
		res.setHeader("Content-Type", "application/json");
		res.end(
			JSON.stringify({
				success: false,
				data: null,
				message: err?.message || "Database connection failed",
			})
		);
		return;
	}

	return app(req, res);
};
