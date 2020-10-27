export const PROJECT_NAME = ".pablomag: personal blog";
export const PROJECT_VERSION = "1.1.0";

export const ENV_PRODUCTION = process.env.NODE_ENV === "production";

export const API_URI = process.env.API_URI || "http://localhost";
export const API_PORT = process.env.API_PORT || 5555;
export const API_SECRET = process.env.API_SECRET || "bubblegum_cat";
export const API_URL = API_URI === "http://localhost" ? `${API_URI}:${API_PORT}` : API_URI;

export const CLIENT_URI = process.env.CLIENT_URI || "http://localhost";
export const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
export const CLIENT_URL = CLIENT_URI === "http://localhost" ? `${CLIENT_URI}:${CLIENT_PORT}` : CLIENT_URI;

export const IMG_SERVICE_URI = process.env.IMG_SERVICE_URI || "http://localhost";
export const IMG_SERVICE_PORT = process.env.IMG_SERVICE_PORT || 3333;
export const IMG_SERVICE_URL = IMG_SERVICE_URI === "http://localhost" ? `${IMG_SERVICE_URI}:${IMG_SERVICE_PORT}` : IMG_SERVICE_URI;

export const REDIS_HOST = process.env.REDIS_HOST || "http://localhost";
export const REDIS_PORT = parseInt(process.env.REDIS_PORT!) || 6379;
export const REDIS_PASS = process.env.REDIS_PASS || "";

export const DB_CONNECTION = process.env.DB_CONNECTION || "mongodb://host:port/dbname?authSource=table"
export const DB_USER = process.env.DB_USER || "good"
export const DB_PASS = process.env.DB_PASS || "gorilla"

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "google.client.id";
