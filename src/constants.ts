export const PROJECT_NAME = ".pablomag: personal blog";
export const PROJECT_VERSION = "1.1.0";

export const ENV_PRODUCTION = process.env.NODE_ENV === "production";

export const API_URI = process.env.API_URI || "http://localhost";
export const API_PORT = process.env.API_PORT || 5555;
export const API_SECRET = process.env.API_SECRET || "bubblegum_cat";

export const CLIENT_URI = process.env.CLIENT_URI || "http://localhost";
export const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

export const IMG_SERVICE_URI = process.env.IMG_SERVICE_URI || "http://localhost";
export const IMG_SERVICE_PORT = process.env.IMG_SERVICE_PORT || 3333;

export const DB_CONNECTION = process.env.DB_CONNECTION || "mongodb://host:port/dbname?authSource=table"
export const DB_USER = process.env.DB_USER || "good"
export const DB_PASS = process.env.DB_PASS || "gorilla"

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "google.client.id";
