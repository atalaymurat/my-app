// backend/index.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require('./config/db'); // Import the connectDB function
const { corsOptions, allowedOrigins } = require('./config/corsOptions');

// --- Connect to Database ---
connectDB(); // Call the function to establish the connection


const app = express();
const PORT = process.env.PORT || 5000;

// --- Log Allowed CORS Origins ---
// Log this info early so it's visible during startup
console.log("--------------------------------");
console.log("Allowed CORS Origins:");
if (allowedOrigins && allowedOrigins.length > 0) {
    allowedOrigins.forEach(origin => console.log(`- ${origin}`));
} else {
    console.log("- (No specific origins defined - Check .env FRONTEND_URL)");
}
console.log("--------------------------------");

// Apply CORS Middleware with imported options
// Place CORS middleware early, especially before routes
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/api", require("./routes/auth"));

// --- Basic Root Route (Optional) ---
app.get('/', (req, res) => {
  res.send('API is running...');
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
