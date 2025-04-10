import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const cookietoken = req.cookies?.token;
    const authHeader = req.headers['authorization'];
    const headertoken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(' ')[1] : null;

    const token = cookietoken || headertoken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expired" });
            }
            console.error('Token verification error:', err.message);
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }

        req.user = decoded;
        next();
    });
};

export default verifyToken;
