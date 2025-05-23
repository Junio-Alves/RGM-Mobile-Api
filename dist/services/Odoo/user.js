import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const odooFetchUserData = async (email) => {
    try {
        const response = await axios.post(`${process.env.ODOO_URL}/jsonrpc`, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    process.env.ODOO_DB, // Nome do banco de dados
                    process.env.ODOO_UID, // O uid result retornado da autenticação
                    process.env.ODOO_API_KEY, // Senha do usuário
                    "hr.employee", // Nome do modelo (tabela)
                    "search_read", // Método a ser chamado (search_read para buscar dados)
                    [
                        [["work_email", "=", email]]
                    ],
                    {
                        fields: ["id", "work_email", "name", "x_studio_senha", "message_partner_ids"] // Campos que você quer verificar
                    }
                ]
            },
            "id": 2
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.data.result === undefined || response.data.result.length === 0) {
            return null;
        }
        const user = response.data.result[0];
        return {
            id: user.id,
            name: user.name,
            work_email: user.work_email,
            password: user.x_studio_senha,
            partner_id: user.message_partner_ids[0],
        }; // Retorna o usuário encontrado
    }
    catch (error) {
        console.error('Erro ao buscar dados do usuário no Odoo:', error);
        throw error;
    }
};
export const odooChangeUserPassword = async (userId, newPassword) => {
    try {
        const response = await axios.post(`${process.env.ODOO_URL}/jsonrpc`, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    process.env.ODOO_DB, // Nome do banco de dados
                    process.env.ODOO_UID, // O uid result retornado da autenticação
                    process.env.ODOO_API_KEY, // Senha do usuário
                    "hr.employee", // Nome do modelo (tabela)
                    "write", // Método a ser chamado (search_read para buscar dados)
                    [[userId], {
                            "x_studio_senha": newPassword // Campos que você quer verificar
                        }]
                ]
            },
            "id": 2
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.result; // Retorna os projetos encontrados
    }
    catch (error) {
        console.error('Erro ao alterar senha:', error);
        throw error;
    }
};
