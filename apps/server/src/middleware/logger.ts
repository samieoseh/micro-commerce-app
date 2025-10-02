import morgan, { StreamOptions } from "morgan";
import logger from "../utils/logger";

// Stream writes Morgan logs into Winston
const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

// Skip logging in test environment
const skip = () => process.env.NODE_ENV === "test";

export const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);
