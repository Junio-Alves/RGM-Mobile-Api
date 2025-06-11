import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';
import { odooFetchUserData } from '../../services/Odoo/user.js';
import bcrypt from 'bcrypt';
export const Login = async (req, res) => {
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
        // Verifica se a senha está hashada
        // Se sim, compara a senha hashada com a senha fornecida
        // Se não, compara a senha normal(literal) com a senha fornecida
        if (user.password.startsWith("$2b$")) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    errors: ["Invalid credentials"],
                });
                return;
            }
        }
        else {
            if (user.password !== password) {
                res.status(401).json({
                    errors: ["Invalid credentials"],
                });
                return;
            }
        }
        const token = jwt.sign({ id: user.id, nome: user.name, email: user.work_email, user_partner_id: user.partner_id }, process.env.JWT_SECRET);
        res.status(200).json({
            token: token,
            data: {
                id: user.id,
                name: user.name,
                email: user.work_email,
                user_partner_id: user.partner_id,
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
