const validateTextLength = (min = 10, max = 5000) => {
    return (req, res, next) => {
        try {
            const text = req.body.text || req.body.content;
            if (text !== undefined) {
                const trimmedLength = text.trim().length;
                if (trimmedLength < min) {
                    return res.status(400).json({ 
                        error: `Text is too short. Minimum required length is ${min} characters.` 
                    });
                }
                if (trimmedLength > max) {
                    return res.status(400).json({ 
                        error: `Text is too long. Maximum allowed length is ${max} characters.` 
                    });
                }
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = validateTextLength;