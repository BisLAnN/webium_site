const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'Вы не авторизованы!' });
        }

        const tokenWithoutBearer = token.split(' ')[1];

        if (!tokenWithoutBearer) {
            return res.status(403).json({ message: 'Вы не авторизованы!' });
        }

        const decodedData = jwt.verify(tokenWithoutBearer, secret);
        req.user = decodedData;
        next();
    } 
    
    catch (e) {
        console.log(e);
        return res.status(403).json({ message: 'Вы не авторизованы!' });
    }
};
