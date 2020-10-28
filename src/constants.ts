export const PROJECT_NAME = ".pablomag: personal blog";
export const PROJECT_VERSION = "1.1.0";

export const ENV_PRODUCTION = process.env.NODE_ENV === "production";

export const API_PORT = process.env.API_PORT || 5555;
export const API_URL = process.env.API_URL || `http://localhost:${API_PORT}`;
export const API_SECRET = process.env.API_SECRET || "bubblegum_cat";

export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
export const IMG_SERVICE_URL = process.env.IMG_SERVICE_URL || "http://localhost:3333";

export const REDIS_HOST = process.env.REDIS_HOST || "http://localhost";
export const REDIS_PORT = parseInt(process.env.REDIS_PORT!) || 6379;
export const REDIS_PASS = process.env.REDIS_PASS || "";

export const DB_CONNECTION = process.env.DB_CONNECTION || "mongodb://host:port/dbname?authSource=table"
export const DB_USER = process.env.DB_USER || "good"
export const DB_PASS = process.env.DB_PASS || "gorilla"

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "google.client.id";
export const ACCEPT_NEW_USERS = process.env.ACCEPT_NEW_USERS || false;
