const serverless = require("serverless-http");
const app = require("../app/app");
const dbConnect = require("../config/dbConnect");

const handler = serverless(app);

module.exports.handler = async (event, context) => {
    // Ensure DB is connected before handling the request
    context.callbackWaitsForEmptyEventLoop = false;
    await dbConnect();

    // Forward to express
    return await handler(event, context);
};
