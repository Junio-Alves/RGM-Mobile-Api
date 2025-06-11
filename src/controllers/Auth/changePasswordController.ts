import { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import { odooChangeUserPassword, odooFetchUserData } from '../../services/Odoo/user.js';
import bcrypt from 'bcrypt';


export const ChangePassword = async (req: Request, res: Response) => {
    try {
        const { email, password, newPassword } = req.body || {};

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

        if (user.password.startsWith("$2b$")) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    errors: ["Invalid credentials"],
                });
                return;
            }
        } else {
            if (user.password !== password) {
                res.status(401).json({
                    errors: ["Invalid credentials"],
                });
                return;
            }
        }

        if (!newPassword) {
            res.status(400).json({
                errors: ["New password not provided"],
            });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({
                errors: ["New password must be at least 6 characters long"],
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const response = await odooChangeUserPassword(user.id, hashedPassword);
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