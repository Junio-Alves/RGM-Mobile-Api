import { Request, Response } from 'express';
import odooService from '../services/odooService.js';
import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';

class Login {
    // Definindo o método 'login' para ser um controlador de rota
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body || {};

            if (!email || !password) {
                res.status(400).json({
                    errors: ["Invalid credentials"],
                });
                return;
            }
            
            const data = await odooService.odooFetchUserData(email);
            if (!data) {
                res.status(401).json({
                    errors: ["Invalid credentials"],
                });
                return;
            }

            if (data.password !== password) {
                res.status(401).json({
                    errors: ["Invalid credentials"],
                });
                return;
            }
          
            const token = jwt.sign({ id: data.id, nome: data.name, email: data.work_email }, process.env.JWT_SECRET!);

            res.status(200).json({
                token: token,
                data: {
                    id: data.id,
                    name: data.name,
                    email: data.work_email
                }
            });

        } catch (error) {
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
}

export default new Login();  // Exporta a instância de Login
