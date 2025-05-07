import { Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import { AuthenticatedRequest } from '../interfaces/IAuthenticatedRequest.js';

// Função para buscar os projetos do Odoo
export const fetchTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
   
  } catch (error) {
    console.error('Erro ao buscar projetos do Odoo:', error);
    res.status(500).json({ message: 'Erro ao buscar projetos do Odoo.', error: error });
  }
};