import axios, { AxiosResponse } from 'axios';
import dotenv from "dotenv";
dotenv.config();
import { saveSessionId, getSessionId } from '../utils/sessionStore.js';
import { IUserInterface } from '../interfaces/iUserInterface.js';


// Função para configurar axios com o session_id nos headers
const setSessionIdCookie = (sessionId: string) => {
    saveSessionId(sessionId); // Salva o session_id no banco de dados
};

const getSessionIdCookie = (): string => {
    const sessionId = getSessionId(); // Obtém o session_id do banco de dados
    if (!sessionId) {
        throw new Error('session_id não encontrado.');
    }
    return sessionId;
}

class OdooService {
    /*odooLogin = async () => {
        try {
            const response: AxiosResponse = await axios.post(
                `${process.env.ODOO_URL}/web/session/authenticate`,
                {
                    params: {
                        db: process.env.ODOO_DB,
                        login: process.env.ODOO_USER,
                        password: process.env.ODOO_PASSWORD,
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const setCookie = response.headers['set-cookie'];
            if (!setCookie || setCookie.length === 0) {
                throw new Error('Nenhum cookie de sessão retornado.');
            }

            const sessionIdMatch = setCookie[0].match(/session_id=([^;]+);/);
            if (!sessionIdMatch) {
                throw new Error('session_id não encontrado.');
            } 1
            setSessionIdCookie(sessionIdMatch[1]);

        } catch (error) {
            console.error('Erro ao logar no Odoo:', error);
            throw error;
        }
    };*/

    odooFetchUserData = async (email: string): Promise<IUserInterface | null> => {
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
                            "7",         // O uid result retornado da autenticação
                            process.env.ODOO_API_KEY,    // Senha do usuário
                            "hr.employee",// Nome do modelo (tabela)
                            "search_read", // Método a ser chamado (search_read para buscar dados)
                            [
                                [["work_email", "=", email]]
                            ],
                            {
                                fields: ["id","work_email","name","x_studio_senha","user_partner_id"]    // Campos que você quer verificar
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
            if (response.data.result === undefined || response.data.result.length === 0) {
                return null;
            }
            const user = response.data.result[0];
            return {
                id: user.id,
                name: user.name,
                work_email: user.work_email,
                password: user.x_studio_senha,
                partner_id: user.user_partner_id[0],
            } as IUserInterface; // Retorna o usuário encontrado
        } catch (error) {
            console.error('Erro ao buscar dados do usuário no Odoo:', error);
            throw error;
        }
    }
    odooFetchProjects = async (user_partner_id: number) => {
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
                            "7",
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
    odooFetchTasks = async () => {

    }

    // Função para verificar se a sessão expirou
    isSessionExpired = (response: AxiosResponse) => {
        // Verifica se o erro no corpo da resposta contém "Session expired"
        if (response.data && response.data.error && response.data.error.message === 'Session expired') {
            return true; // A sessão expirou
        }
        return false; // A sessão está ativa
    };
}

export default new OdooService();
