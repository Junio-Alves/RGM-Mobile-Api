import { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';
import { odooChangeUserPassword, odooFetchUserData } from '../services/Odoo/user.js';


export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            res.status(400).json({
                errors: ["Invalid credentials"],
            });
            return;
        }

        const user = await odooFetchUserData(email);
        if (!user) {
            res.status(401).json({
                errors: ["Invalid credentials"],
            });
            return;
        }

        if (user.password !== password) {
            res.status(401).json({
                errors: ["Invalid credentials"],
            });
            return;
        }

        const token = jwt.sign({ id: user.id, nome: user.name, email: user.work_email, user_partner_id: user.partner_id }, process.env.JWT_SECRET!);

        res.status(200).json({
            token: token,
            data: {
                id: user.id,
                name: user.name,
                email: user.work_email,
                user_partner_id: user.partner_id,
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export const ChangePassword = async (req: Request, res: Response) => {
    try {
        const { email, password,newPassword } = req.body || {};

        if (!email || !password) {
            res.status(400).json({
                errors: ["Invalid credentials"],
            });
            return;
        }

        const user = await odooFetchUserData(email);

        if (!user) {
            res.status(401).json({
                errors: ["Invalid credentials"],
            });
            return;
        }
        
        if (user.password !== password) {
            res.status(401).json({
                errors: ["Invalid credentials"],
            });
            return;
        }
        if(!newPassword){
            res.status(400).json({
                errors: ["New password not provided"],
            });
            return;
        }

        const response = await odooChangeUserPassword(user.id,newPassword);
        if (response) {
            res.status(200).json({
                message: "Password changed successfully",
            });
        }
        else {
            res.status(401).json({
                errors: ["Invalid credentials"],
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}
