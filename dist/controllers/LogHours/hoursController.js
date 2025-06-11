import dotenv from "dotenv";
dotenv.config();
import { odooFetchLogHours, odooLogHours } from '../../services/Odoo/hours.js';
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
            res.status(204).json({ error: 'Nenhum apontamento encontrado.' });
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
        if (unit_amount <= 0 || unit_amount > 12) {
            res.status(400).json({ error: 'A quantidade de horas deve ser maior que 00:00 e menor ou igual a 12:00.' });
            return;
        }
        const inputDate = new Date(date);
        const now = new Date();
        if (inputDate > now) {
            res.status(400).json({ error: 'A data não pode ser no futuro.' });
            return;
        }
        const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|--|;|\/\*|\*\/)\b|['"=\\])/i;
        if (sqlInjectionPattern.test(logName)) {
            res.status(400).json({ error: 'Nome do apontamento inválido.' });
            return;
        }
        if (logName.length > 280) {
            res.status(400).json({ error: 'O nome do apontamento deve ter no máximo 280 caracteres.' });
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
