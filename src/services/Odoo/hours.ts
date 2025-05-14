import axios from "axios";

export const odooFetchLogHours = async (task_id: number, user_id:number) => {
    try {
        const response = await axios.post(
            `${process.env.ODOO_URL}/jsonrpc`,
            {
                jsonrpc: "2.0",
                method: "call",
                params: {
                    "service": "object",
                    "method": "execute_kw",
                    "args": [
                        process.env.ODOO_DB,
                        process.env.ODOO_UID,
                        process.env.ODOO_API_KEY,        // Senha do usuário
                        "account.analytic.line",         // Modelo
                        "search_read",         // Método
                        [
                            [
                                ["task_id", "=", task_id],
                                ["employee_id", "=", user_id]
                            ]  // Domínio da busca
                        ],
                        {
                            "fields": ["id", "name", "unit_amount", "date"]
                        }
                    ]
                },
                "id": 2
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.result; // Retorna os projetos encontrados
    } catch (error) {
        console.error('Erro ao buscar apontamento de horas do Odoo:', error);
        throw error;
    }
}
export const odooLogHours = async () => { }