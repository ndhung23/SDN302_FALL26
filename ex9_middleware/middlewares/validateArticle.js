const validateArticle = async (req, res, next) => {
    try {
        const { title, date } = req.body;
        const text = req.body.text || req.body.content;
        if (!title || !date || !text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error validating article');
    }
};

module.exports = validateArticle;