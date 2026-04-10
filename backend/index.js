// backend/index.js
require("dotenv").config();
require("./utils/keepAlive");
const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { corsOptions, allowedOrigins } = require("./config/corsOptions");
const logger = require("./config/logger");
const requestId = require("./middleware/requestId");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");
const { init: initSocket } = require("./config/socket");

if (process.env.SENTRY_DSN) {
  const Sentry = require("@sentry/node");
  Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
}

process.on("uncaughtException", (err) => {
  logger.error({ message: "uncaughtException", error: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ message: "unhandledRejection", reason: String(reason) });
  process.exit(1);
});

connectDB();

const app = express();
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3021;

logger.info("Allowed CORS Origins: " + (allowedOrigins?.join(", ") || "(none)"));

app.use(requestId);
app.use(requestLogger);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api", require("./routes/index"));

app.get("/", (req, res) => res.send("API is running..."));
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "backend" });
});


// Bot/scanner trafiğini sessizce reddet
app.use((req, res, next) => {
  const botPaths = ['.php', '.env', '.git', '.aws', '.s3cfg', 'wp-', 'wordpress', 'admin', '.sql', '.bak'];
  if (botPaths.some(p => req.path.toLowerCase().includes(p))) {
    return res.status(404).end();
  }
  next();
});

app.use((req, res, next) => {
  next(new AppError(`${req.originalUrl} bulunamadı.`, 404));
});

app.use(errorHandler);

server.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  const { runHealthChecks } = require("./utils/serviceHealthCheck");
  await runHealthChecks();
});
