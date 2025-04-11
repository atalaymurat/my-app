// backend/config/corsOptions.js

// Define the list of allowed origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000"
].filter(Boolean); // Use filter(Boolean) to remove potential undefined/null entries if FRONTEND_URL isn't set

// Configure CORS options
const corsOptions = {
    /**
     * @param {string | undefined} origin - The origin of the request (e.g., 'http://localhost:3000')
     * @param {function(Error | null, boolean | undefined)} callback - Callback function
     */
    origin: function (origin, callback) {
        // Allow requests with no origin OR from allowed origins
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS: Denied origin - ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 200
};

// Export BOTH the options object and the list of allowed origins
module.exports = { corsOptions, allowedOrigins };