const jwt = require('jsonwebtoken');

class Middleware {
    static checkAuth(req, res, next) {
        const token = req.headers.authorization;
        if(token) {
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                (err) ? res.status(401).json({message: 'Invalid token'}) : next();
            })
        } else {
            res.status(401).json({
                message: 'No token provided'
            })
        }
    }
}

module.exports = Middleware;