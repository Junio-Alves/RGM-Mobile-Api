import { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const Logout = async (req: Request, res: Response) => {
    try {
      

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

