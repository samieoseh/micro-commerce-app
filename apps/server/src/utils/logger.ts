import { createLogger, format, transports } from "winston";

// Define custom log levels (optional)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Determine log level based on NODE_ENV
const level = () => {
  const env = process.env.NODE_ENV || "development";
  if (env === "production") {
    return "info"; // no debug logs in prod
  }
  if (env === "test") {
    return "warn"; // minimal logs in tests
  }
  return "debug"; // full logs in dev
};

const logger = createLogger({
  level: level(),
  levels,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "server" },
  transports: [
    new transports.Console({
      format: process.env.NODE_ENV === "production"
        ? format.combine(format.timestamp(), format.json())
        : format.combine(format.colorize(), format.simple()),
    }),

    // File logging for production
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// Handle uncaught exceptions & rejections
logger.exceptions.handle(
  new transports.File({ filename: "logs/exceptions.log" })
);

logger.rejections.handle(
  new transports.File({ filename: "logs/rejections.log" })
);

export default logger;
