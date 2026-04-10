const logger = require("../config/logger");

const SKIP_PATHS = new Set(["/health", "/"]);

const requestLogger = (req, res, next) => {
  if (SKIP_PATHS.has(req.path)) return next();

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    // Production'da sadece 4xx/5xx logla
    if (process.env.NODE_ENV === "production" && status < 400) return;

    const contentLength = res.getHeader("content-length");

    logger.http({
      message: `${req.method} ${req.path} → ${status} (${duration}ms)`,
      meta: {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        status,
        duration,
        userId: req.user?._id || null,
        ...(contentLength ? { contentLength: Number(contentLength) } : {}),
      },
    });
  });

  next();
};

module.exports = requestLogger;
