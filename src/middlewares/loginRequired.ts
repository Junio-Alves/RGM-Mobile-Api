import { Request, Response,NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
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
    console.log(token);
    try{
        const dados = jwt.verify(token, process.env.JWT_SECRET!);
        const { id, nome, email } = dados as { id: number; nome: string; email: string };
        next();
    }catch(e){
        res.status(401).json({
            errors: ["Token invalid"],
        });
        return;
    }
}