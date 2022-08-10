const jwt = require('jsonwebtoken');
const atob = require('atob');

class Middleware {
    static checkUserAuth(req, res, next) {
        const token = req.headers.authorization;
        let username = null;
        if(token) {
            username = JSON.parse(atob(token.split('.')[1])).username;
            if(token && username === req.params.username) {
                jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                    (err) ? res.status(401).json({message: 'Invalid token'}) : next();
                })
            } else {
                res.status(401).json({
                    message: 'Invalid token'
                })
            }
        }
        else {
            res.status(401).json({
                message: 'No token provided'
            })
        }
    }
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