import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
// Middleware para verificar se o usuário está autenticado
export default function loginRequired(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).json({
            errors: ["Login required"],
        });
        return;
    }
    const [, token] = authorization.split(" ");
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = {
            id: data.id,
            name: data.nome,
            work_email: data.email,
            partner_id: data.user_partner_id,
        };
        req.user = user; // Adiciona o usuário ao objeto de requisição
        next();
    }
    catch (e) {
        res.status(401).json({
            errors: ["Token invalid"],
        });
        return;
    }
}
