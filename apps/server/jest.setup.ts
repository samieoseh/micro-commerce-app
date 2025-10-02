import * as dotenv from "dotenv";

const env = process.env.NODE_ENV || "test";
dotenv.config({ path: `.env.${env}` });
