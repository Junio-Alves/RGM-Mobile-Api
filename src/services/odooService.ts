import axios, { AxiosResponse } from 'axios';
import dotenv from "dotenv";
dotenv.config();
import { saveSessionId, getSessionId } from '../utils/sessionStore.js';


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
    odooLogin = async () => {
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
    };

    odooFetchUserData = async (email: string) => {
        const sessionId = getSessionIdCookie(); // Obtém o session_id do banco de dados
        try {
            const response = await axios.post(
                `${process.env.ODOO_URL}/web/dataset/call_kw/hr.employee/search_read`,
                {
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        model: 'hr.employee',
                        method: 'search_read',
                        args: [[['work_email', '=', email]]],
                        kwargs: {
                            fields: ['id', 'name', 'work_email'], // Adicione os campos desejados aqui
                            limit: 100,
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
            if(response.data.result === undefined || response.data.result.length === 0) {
                return "Usuário não encontrado";
            }
            return response.data.result; // Retorna os dados do usuário
        } catch (error) {
            console.error('Erro ao buscar dados do usuário no Odoo:', error);
            throw error;
        }
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
