import { verifyToken } from '../utils/jwt';
import User from '../models/User.js';
export const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies.accessToken || ((req.headers.authorization || '').startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
        if (!token) return res.status(401).json({
            success: false,
            message: 'Authentication required',
            errors: []
        });
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select('-password');
        if (!user || !user.isActive) return res.status(401).json({
            success: false,
            message: 'User is inactive or no longer exists',
            errors: []
        });
        req.user = user;
        next();
    } catch (e) {
        next(e);
    }
};