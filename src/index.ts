import path from "path";
import express from "express";
import cors from "cors";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import moment from "moment";

import { generateNonce, getDirectives } from "./util/csp";

import { ENV_PRODUCTION, CLIENT_URL, API_SECRET, REDIS_HOST, REDIS_PORT, REDIS_PASS } from "./constants";

export const app = express();

const main = async (app: express.Application) => {
    require("./util/database");

    const compression = require("compression");
    const helmet = require("helmet");
    const hbs = require("express-handlebars");
    const csp = require("helmet-csp");

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient({
        port: REDIS_PORT,
        host: REDIS_HOST,
        //password: REDIS_PASS
    });
console.log(REDIS_PASS);
    app.use(compression());
    app.use(helmet());

    app.set("trust proxy", true);

    app.engine(
        "hbs",
        hbs({
            extname: "hbs",
            defaultLayout: "layout",
            helpers: {
                formatDate: (date: moment.MomentInput, format: string) => {
                    return moment(date).format(format);
                },
                fromNow: (date: moment.MomentInput) => {
                    return moment(date).fromNow();
                },
            },
        })
    );

    app.use(
        cors({
            origin: `${CLIENT_URL}`,
            credentials: true,
        })
    );

    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: !ENV_PRODUCTION,
                sameSite: "lax",
                secure: ENV_PRODUCTION,
            },
            secret: API_SECRET,
            resave: false,
            saveUninitialized: false,
        })
    );

    app.use(generateNonce);
    app.use(
        csp({
            directives: getDirectives(),
        })
    );

    require("./router/index")(app);

    app.use("/", express.static(path.join(__dirname, "/")));
};

main(app).catch((error) => {
    console.error("App error", error);
});
