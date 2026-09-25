const validateDateFormat = (req, res, next) => {
    try {
        const { date } = req.body;
        if (date) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                return res.status(400).json({ 
                    error: 'Invalid date format. Expected YYYY-MM-DD (e.g., 2026-06-02)' 
                });
            }
            const parsedDate = new Date(date);
            const [year, month, day] = date.split('-').map(Number);
            if (
                parsedDate.getFullYear() !== year ||
                parsedDate.getMonth() + 1 !== month ||
                parsedDate.getDate() !== day
            ) {
                return res.status(400).json({ error: 'Date provided does not exist on the calendar' });
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateDateFormat;