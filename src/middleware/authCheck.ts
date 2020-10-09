import { Request, Response, NextFunction } from "express";

export async function authCheck(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    try {
        if (!req.session) {
            return res.status(401).send("User not logged in");
        }
        if (!req.session.token || !req.session.user) {
            return res
                .status(401)
                .send("Access denied. No authentication provided.");
        }
    } catch (error) {
        console.error("Error: " + error);
    }
    next();
}

export default authCheck;
