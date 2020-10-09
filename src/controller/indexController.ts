import { Request, Response, Router } from "express";

const router = Router();

router.get(
    "/",
    async (req: Request, res: Response): Promise<any> => {
        const user = req.session!.user ? req.session!.user[0] : null;
        res.render("index.hbs", { user });
    }
);

export default router;
