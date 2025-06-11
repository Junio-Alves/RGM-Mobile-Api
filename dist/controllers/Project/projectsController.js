import dotenv from "dotenv";
dotenv.config();
import { odooFetchProjects } from '../../services/Odoo/projects.js';
// Função para buscar os projetos do Odoo
export const fetchProjects = async (req, res) => {
    try {
        const user = req.user; // Obtém o usuário do objeto de requisição
        const { project_id } = req.body || {}; // Obtém o ID do projeto do corpo da requisição, caso exista
        const projects = await odooFetchProjects(user.partner_id, project_id);
        // Verifica se a resposta contém os projetos
        if (projects && projects.length > 0) {
            res.status(200).json(projects); // Retorna os projetos encontrados
        }
        else {
            res.status(204).json({ error: 'Nenhum projeto encontrado.' });
        }
    }
    catch (error) {
        console.error('Erro ao buscar projetos do Odoo:', error);
        res.status(500).json({ message: 'Erro ao buscar projetos do Odoo.', error: error });
    }
};
