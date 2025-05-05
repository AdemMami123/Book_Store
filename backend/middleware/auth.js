import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protectRoute = async (req, res, next) => {
    try {
        //get token
        const token = req.headers.authorization.replace('Bearer ', '');

        if(!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //find user
        const user = await User.findById(decoded.id).select('-password');
        if(!user) {
            return res.status(401).json({ message: 'Not authorized, no user found' });
        }
        req.user=user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}
export default protectRoute;