import dotenv from "dotenv";
dotenv.config();
export const Logout = async (req, res) => {
    try {
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
