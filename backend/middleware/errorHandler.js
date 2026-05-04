const logger = require("../config/logger");
const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.too.large") {
    err.statusCode = 413;
    err.status = "fail";
    err.isOperational = true;
    err.message = "Aktarım dosyası çok büyük. Daha küçük bir CSV dosyası seçin veya aktarımı parçalara bölün.";
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.statusCode === 404) {
    logger.warn({ message: err.message, path: req.originalUrl });
  } else {
    logger.error({
      message: err.message,
      statusCode: err.statusCode,
      requestId: req.requestId,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  // Sentry (varsa)
  if (process.env.SENTRY_DSN) {
    const Sentry = require("@sentry/node");
    Sentry.captureException(err);
  }

  const isProd = process.env.NODE_ENV === "production";

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      requestId: req.requestId,
    });
  }

  // Programming error — prod'da detay gizle
  return res.status(500).json({
    status: "error",
    message: isProd ? "Bir hata oluştu." : err.message,
    ...(isProd ? {} : { stack: err.stack }),
    requestId: req.requestId,
  });
};

module.exports = errorHandler;
