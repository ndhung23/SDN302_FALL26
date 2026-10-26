const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const getMembers = () => {
    const candidatePaths = [
        path.join(__dirname, '..', 'members.json'),
        path.join(__dirname, '..', '..', 'members.json'),
        path.join(process.cwd(), 'members.json')
    ];

    for (const filePath of candidatePaths) {
        if (fs.existsSync(filePath)) {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            } catch (err) {
                console.error(`Error reading ${filePath}:`, err.message);
            }
        }
    }

    return [{ name: 'storeadmin', pass: 'Store@123' }];
};

exports.issueToken = (req, res) => {
    try {
        const name = req.body?.name || req.body?.username;
        const pass = req.body?.pass || req.body?.password;

        if (!name || !pass) {
            return res.status(401).json({
                message: 'Invalid credentials: name and pass are required'
            });
        }

        const members = getMembers();
        const matchedMember = members.find(m => {
            const mName = m.name || m.username;
            const mPass = m.pass || m.password;
            return mName === name && mPass === pass;
        });

        if (!matchedMember) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const payload = {
            name: matchedMember.name || matchedMember.username,
            role: matchedMember.role || 'admin'
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                message: 'JWT_SECRET is not configured'
            });
        }

        const token = jwt.sign(payload, secret, { expiresIn: '2h' });

        return res.status(200).json({
            message: 'Token issued successfully',
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error while generating token',
            error: error.message
        });
    }
};

