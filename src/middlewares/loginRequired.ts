import { Request, Response,NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { IUserInterface } from '../interfaces/iUserInterface';
dotenv.config();

// Middleware para verificar se o usuário está autenticado
export default function loginRequired(req:Request, res:Response, next:NextFunction):void {
    const { authorization } = req.headers;
    if( !authorization){
        res.status(401).json({
            errors: ["Login required"],
        });
        return;
    }
    const[ ,token] = authorization.split(" ");
    try{
        const data = jwt.verify(token, process.env.JWT_SECRET!);
        const user = {
            id: (data as any).id,
            name: (data as any).nome,
            work_email: (data as any).email,
            partner_id: (data as any).user_partner_id,
        } as IUserInterface;

        (req as any).user = user; // Adiciona o usuário ao objeto de requisição
        next();
    }catch(e){
        res.status(401).json({
            errors: ["Token invalid"],
        });
        return;
    }
}