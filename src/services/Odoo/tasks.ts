import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const odooFetchTasks = async (user_partner_id: number, project_id: number) => {
    try {
        const response = await axios.post(
            `${process.env.ODOO_URL}/jsonrpc`,
            {
                jsonrpc: "2.0",
                method: "call",
                params: {
                    service: "object",
                    method: "execute_kw",
                    args: [
                        process.env.ODOO_DB,     // Nome do banco de dados
                        process.env.ODOO_UID,         // O uid result retornado da autenticação
                        process.env.ODOO_API_KEY,    // Senha do usuário
                        "project.task",// Nome do modelo (tabela)
                        "search_read", // Método a ser chamado (search_read para buscar dados)
                        [
                              [
                                ["message_partner_ids", "in", [user_partner_id]],
                                ["project_id", "=", project_id]
                              ]
                        ],
                        {
                             "fields": ["id", "name", "project_id","date_deadline","planned_date_start","allocated_hours","subtask_allocated_hours","remaining_hours","effective_hours","total_hours_spent","description"]    // Campos que você quer verificar
                        }
                    ]
                },
                id: 2
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.data.result === undefined || response.data.result.length === 0) {
            return null;
        }
        return response.data.result; // Retorna os projetos encontrados
    } catch (error) {
        console.error('Erro ao buscar projetos do Odoo:', error);
        throw error;
    }
};