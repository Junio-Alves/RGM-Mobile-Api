import { Request, Response } from 'express';
import dotenv from "dotenv";
import { getSessionId } from '../utils/sessionStore.js';
dotenv.config();
import odooService from '../services/odooService.js';
import { AuthenticatedRequest } from '../interfaces/IAuthenticatedRequest.js';

// Função para buscar os projetos do Odoo
export const fetchProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!; // Obtém o usuário do objeto de requisição
    const projects = await odooService.odooFetchProjects(user.partner_id);

    // Verifica se a resposta contém os projetos
    if (projects && projects.length > 0) {
      res.status(200).json(projects); // Retorna os projetos encontrados
    } else {
      res.status(404).json({ error: 'Nenhum projeto encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar projetos do Odoo:', error);
    res.status(500).json({ message: 'Erro ao buscar projetos do Odoo.', error: error });
  }
};
