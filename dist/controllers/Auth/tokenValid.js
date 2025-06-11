export const validate = async (req, res) => {
    try {
        res.status(200).json({
            message: "Token is valid",
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
