import { Request, Response } from 'express';
export const validate = async (req: Request, res: Response) => {
    try {
       res.status(200).json({
        message: "Token is valid",})
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}