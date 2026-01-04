const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: "failed",
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
    // Custom keyGenerator for Vercel/proxy environments to handle Forwarded header
    keyGenerator: (req) => {
        // Use X-Forwarded-For header if available (set by proxies like Vercel)
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            // X-Forwarded-For can contain multiple IPs, get the first one (client IP)
            return forwarded.split(',')[0].trim();
        }
        // Fallback to direct connection IP
        return req.ip || req.socket?.remoteAddress || 'unknown';
    },
    // Skip validation for the Forwarded header in serverless environments
    validate: {
        xForwardedForHeader: false,
    },
});

module.exports = limiter;
