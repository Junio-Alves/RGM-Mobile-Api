import { Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import { AuthenticatedRequest } from '../../interfaces/IAuthenticatedRequest.js';
import { odooFetchTasks } from '../../services/Odoo/tasks.js';

// Função para buscar os projetos do Odoo
export const fetchTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id,project_id, parent_id,showAllTasks,onlyInProgress } = req.body || {};
    if (!project_id) {
      res.status(400).json({
        errors: ["Project ID required"],
      });
      return;
    }
    const user = req.user!;
   
    //Se não, busca as tasks
    //Se o showAllTasks for true, busca todas as tasks, se não, busca apenas as tasks do usuário
    //Se o onlyInProgress for true, busca apenas as tasks em andamento
    //Se o onlyInProgress for false, busca todas as tasks em outros estados
    const tasks = await odooFetchTasks(project_id,user.partner_id,showAllTasks || false,onlyInProgress || false,id,parent_id);
    if (!tasks) {
      res.status(204).json({
        error: project_id ? 'Nenhuma tarefa encontrada.' : 'Nenhuma subtask encontrada.',
      });
      return;
    }
    //Se o parent_id for fornecido, busca as subtasks
    res.status(200).json(parent_id ? {subtasks: tasks}: {tasks: tasks});
  } catch (error) {
    console.error('Erro ao buscar projetos do Odoo:', error);
    res.status(500).json({ message: 'Erro ao buscar projetos do Odoo.', error: error });
  }
};