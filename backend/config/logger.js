const { createLogger, format, transports } = require("winston");
const MongoTransport = require("./mongoTransport");

const isDev = !["production", "prod"].includes(process.env.NODE_ENV);

const logger = createLogger({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  defaultMeta: { service: "backend", env: process.env.NODE_ENV },
  format: isDev
    ? format.combine(
        format.colorize(),
        format.timestamp({ format: "HH:mm:ss" }),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const extras = Object.keys(meta).length ? JSON.stringify(meta) : "";
          return `${timestamp} ${level}: ${message} ${extras}`;
        })
      )
    : format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new MongoTransport(),
  ],
});

module.exports = logger;
