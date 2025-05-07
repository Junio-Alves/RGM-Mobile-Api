import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const odooFetchProjects = async (user_partner_id: number) => {
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
                        process.env.ODOO_DB,
                        process.env.ODOO_UID,
                        process.env.ODOO_API_KEY,
                        "project.project",
                        "search_read",
                        [
                            [["message_partner_ids", "in", [user_partner_id]]],
                        ],
                        {
                            fields: ["id", "name"],
                        },
                    ],
                },
                id: 2,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.result; // Retorna os projetos encontrados
    } catch (error) {
        console.error('Erro ao buscar projetos do Odoo:', error);
        throw error;
    }
};