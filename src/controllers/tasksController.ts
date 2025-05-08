import { Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import { AuthenticatedRequest } from '../interfaces/IAuthenticatedRequest.js';
import { odooFetchTasks } from '../services/Odoo/tasks.js';

// Função para buscar os projetos do Odoo
export const fetchTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { project_id } = req.body || {};
    if (!project_id) {
      res.status(400).json({
        errors: ["Project ID required"],
      });
      return;
    }
    const user = req.user!; 
    const tasks = await odooFetchTasks(user.partner_id, project_id);
    if (!tasks) {
      res.status(404).json({
        error: 'Nenhum projeto encontrado.',
      });
      return;
    }
    res.status(200).json({
      tasks: tasks,
    });
  } catch (error) {
    console.error('Erro ao buscar projetos do Odoo:', error);
    res.status(500).json({ message: 'Erro ao buscar projetos do Odoo.', error: error });
  }
};