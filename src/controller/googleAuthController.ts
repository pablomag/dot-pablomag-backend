import express from "express";
import bodyParser from "../middleware/bodyParser";

import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../constants";
import { User } from "../entity/User";

const router = express.Router();
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const acceptingNewUsers = true;

router.post(
    "/tokensignout",
    async (req, res): Promise<any> => {
        req.session?.destroy((error: any) => {
            if (error) {
                console.error("Signout error", error);
            }
        });

        res.status(200).send({ message: "User signed out" });
    }
);

router.post(
    "/tokensignin",
    [bodyParser],
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<any> => {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).send({ message: "Access denied. No token provided."});
        }
        if (req.session!.user) {
            return res.status(200).send({ message: "User already logged in", redirect: false });
        }

        try {
            const googleUser = await verify(token).catch((error: any): any => {
                console.error("User verify error", error);
            });

            if (googleUser === "unverified") {
                console.error("User unverified", googleUser);
                return res.status(401).send({ message: "Access denied. Unauthorized." });
            }

            if (googleUser === "expired") {
                console.error("User expired", googleUser);
                return res.status(401).send({ message: "Access denied. Token expired." });
            }

            let user = await checkForUser(googleUser).catch((error: any) => {
                console.error("User check error", error);
            });

            if (user.length === 0) {
                if (acceptingNewUsers) {
                    user = await createUser(googleUser).catch((error: any) => {
                        console.error("Not accepting users error", error);
                    });
                } else {
                    return res
                        .status(401)
                        .send({ message: "Sorry, we are currently not accepting new users" });
                }
            }

            req.session!.token = token;
            req.session!.user = user;

            return res.status(200).send({ message: "User logged in successfully", redirect: true });
        } catch (err) {
            next(err);
        }
    }
);

async function checkForUser(googleUser: any): Promise<any> {
    return await User.find({ userid: googleUser.userid });
}

async function createUser(googleUser: any): Promise<any> {
    const { userid, name, email, picture } = googleUser;
    const user = new User({
        userid,
        name,
        email,
        picture,
    });

    return await user.save();
}

export async function verify(token: string): Promise<any> {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [GOOGLE_CLIENT_ID],
        });

        const payload = ticket.getPayload();

        /** Payload
         *
         * const userid = payload!["sub"];
         * const iss = payload!["iss"];
         * const azp = payload!["azp"];
         * const domain = payload!["hd"];
         */

        const aud = payload!["aud"];
        const user = {
            userid: payload!["sub"],
            name: payload!["name"],
            email: payload!["email"],
            picture: payload!["picture"],
        };

        return aud === GOOGLE_CLIENT_ID ? user : "unverified";
    } catch (exception) {
        console.exception(`EXCEPTION! ${exception}`);
        return "expired";
    }
}

export default router;
