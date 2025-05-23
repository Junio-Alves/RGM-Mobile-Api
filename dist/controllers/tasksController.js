import dotenv from "dotenv";
dotenv.config();
import { odooFetchTasks } from '../services/Odoo/tasks.js';
import { odooFetchSubtasks } from '../services/Odoo/subtasks.js';
// Função para buscar os projetos do Odoo
export const fetchTasks = async (req, res) => {
    try {
        const { project_id, parent_id, showAllTasks } = req.body || {};
        if (!project_id) {
            res.status(400).json({
                errors: ["Project ID required"],
            });
            return;
        }
        const user = req.user;
        //Verifica se o parent_id foi passado
        //Se sim, busca as subtasks
        if (parent_id) {
            const subtasks = await odooFetchSubtasks(user.partner_id, project_id, parent_id);
            if (!subtasks) {
                res.status(404).json({
                    error: 'Nenhuma subtarefa encontrada.',
                });
                return;
            }
            res.status(200).json({
                subtasks: subtasks,
            });
            return;
        }
        //Se não, busca as tasks
        const tasks = await odooFetchTasks(project_id, user.partner_id, showAllTasks || false);
        if (!tasks) {
            res.status(404).json({
                error: 'Nenhum projeto encontrado.',
            });
            return;
        }
        res.status(200).json({
            tasks: tasks,
        });
    }
    catch (error) {
        console.error('Erro ao buscar projetos do Odoo:', error);
        res.status(500).json({ message: 'Erro ao buscar projetos do Odoo.', error: error });
    }
};
