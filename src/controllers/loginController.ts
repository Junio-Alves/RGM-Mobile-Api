import { Request, Response } from 'express';
import odooService from '../services/odooService.js';

class Login {
    // Definindo o método 'login' para ser um controlador de rota
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body || {};

            if (!email || !password) {
                res.status(400).json({
                    errors: ["Invalid credentials"],
                });
            }
            const data = await odooService.odooFetchUserData(email);
            // A lógica de autenticação pode ser inserida aqui

            res.status(200).json({ data: data });

        } catch (error) {
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
}

export default new Login();  // Exporta a instância de Login
