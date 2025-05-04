import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const genertaeToken = (userid) => {
    return jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: '30d' });
}


//login route
router.post('/login', async (req, res) => {
    try{
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    //check if user exists
    const user=await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    //check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    //generate token
    const token = genertaeToken(user._id);
    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        token,
    });

    }
    catch (error) {
        console.log("Error in login route", error);
        res.status(500).json({ message: 'Internal server error' });
    }

    
    
}) 
//register route
router.post('/register', async(req, res) => {
    try {
        const { username,email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        if(username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }
        //check if user already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        //get random avatar image from api
        const profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        //create new user
        const user = new User({
            username,
            email,
            password,
            profilePicture,
        });
        await user.save();
        const token=genertaeToken(user._id);
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            token,
        });

    } catch (error) {
        console.log("Error in register route", error);
        res.status(500).json({ message: 'Internal server error' });
        
    }})


export default router;