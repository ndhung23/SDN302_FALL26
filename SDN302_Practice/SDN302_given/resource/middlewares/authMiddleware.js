const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];

        if (!authHeader) {
            return res.status(401).json({
                message: 'Authorization header is required'
            });
        }

        const parts = authHeader.trim().split(/\s+/);
        if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
            return res.status(401).json({
                message: 'Authorization header must be Bearer token'
            });
        }

        const token = parts[1];
        if (!token) {
            return res.status(401).json({
                message: 'Token is missing'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            error: error.message
        });
    }
};

module.exports = verifyToken;

