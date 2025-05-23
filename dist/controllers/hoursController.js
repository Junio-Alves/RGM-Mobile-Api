import dotenv from "dotenv";
dotenv.config();
import { odooFetchLogHours, odooLogHours } from '../services/Odoo/hours.js';
// Função para buscar os apontamentos de horas do Odoo com base no ID da tarefa
export const fetchLogHours = async (req, res) => {
    try {
        const user = req.user; // Obtém o usuário do objeto de requisição
        const { task_id } = req.body; // Obtém o ID da tarefa do corpo da requisição
        if (!task_id) {
            res.status(400).json({ error: 'ID da tarefa não fornecido.' });
        }
        const logHours = await odooFetchLogHours(task_id, user.id);
        // Verifica se a resposta contém os projetos
        if (logHours && logHours.length > 0) {
            res.status(200).json(logHours); // Retorna os projetos encontrados
        }
        else {
            res.status(404).json({ error: 'Nenhum apontamento encontrado.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar apontamentos do Odoo.', error: error });
    }
};
export const logHours = async (req, res) => {
    try {
        const user = req.user;
        const { logName, project_id, task_id, unit_amount, date, account_id } = req.body;
        if (!logName || !project_id || !task_id || !unit_amount || !date) {
            res.status(400).json({ error: 'Dados insuficientes para registrar horas.' });
            return;
        }
        const result = await odooLogHours(logName, project_id, task_id, user.id, unit_amount, date, account_id);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Erro no endpoint /logHours:', error?.response?.data || error?.message || error);
        res.status(500).json({
            message: 'Erro ao registrar apontamento de horas no Odoo.',
            error: error?.response?.data || error?.message || error,
        });
    }
};
