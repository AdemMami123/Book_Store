import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import 'dotenv/config';

const protectRoute = async (req, res, next) => {
    try {
        // Check if JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set! This will cause authentication to fail.');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        
        //get token
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);
        
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        console.log('Token:', token.substring(0, 20) + '...');
        
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        //find user
        const user = await User.findById(decoded.userid).select('-password');
        console.log('User found:', !!user, user ? `ID: ${user._id}` : 'No user');
        
        if(!user) {
            return res.status(401).json({ message: 'Not authorized, no user found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('Auth middleware error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}
export default protectRoute;