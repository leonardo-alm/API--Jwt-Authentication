import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function checkToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "Access denied!" });

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret!);
        next();
    }
    catch (err) {
        res.status(400).json({ msg: "Invalid token!" });
    }
}

export default { checkToken }