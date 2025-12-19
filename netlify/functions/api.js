const serverless = require("serverless-http");
const app = require("../../backend/app/app");
const dbConnect = require("../../backend/config/dbConnect");

const handler = serverless(app);

module.exports.handler = async (event, context) => {
    // Ensure DB is connected before handling the request
    await dbConnect();

    // Forward to express
    const result = await handler(event, context);
    return result;
};
