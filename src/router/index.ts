import { Request, Response, NextFunction, Application } from "express";

import index from "../controller/indexController";
import post from "../controller/postController";
import apiPost from "../api/controller/postController";
import googleAuth from "../controller/googleAuthController";

import auth from "../middleware/authCheck";

module.exports = function (app: Application) {
    app.use("/api/google", googleAuth);

    app.use((_: Request, res: Response, next: NextFunction) => {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    });

    app.use("/", index);

    app.use("/post", auth, post);

    app.use("/api/post", apiPost);
};
