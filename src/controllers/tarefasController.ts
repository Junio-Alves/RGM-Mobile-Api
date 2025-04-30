import axios from 'axios';
import { Request, Response } from 'express';
import dotenv from "dotenv";
import redis from "../config/db.js"
import { getSessionId } from '../utils/sessionStore.js';
dotenv.config();

// Função para buscar os projetos do Odoo
export const fetchProjects = async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(); // Obtém o session_id do cookie
    // Chama a API para obter os projetos
    const response = await axios.post(
      `${process.env.ODOO_URL}/web/dataset/call_kw/project.project/search_read`,
      {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "project.project",
          method: "search_read",
          args: [],
          kwargs: {
            fields: ["id", "name", "user_id"],
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `session_id=${sessionId}`,
        },
      }
    );

    // Verifica se a resposta contém os projetos
    if (response.data && response.data.result) {
      res.status(200).json(response.data.result); // Retorna os projetos encontrados
    } else {
      res.status(404).json({ error: response.data });
    }
  } catch (error) {
    console.error('Erro ao buscar projetos do Odoo:', error);
    res.status(500).json({ message: 'Erro ao buscar projetos do Odoo.', error: error });
  }
};
