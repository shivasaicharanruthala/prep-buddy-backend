import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'

// imports user model schema
import userModel from '../models/prepBuddy.users.models.js';

// Authorizes the bearer token for protected routes when client uses it
const protect = asyncHandler(async (req , res , next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        try{
            // Splits the bearer token
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            // sends the user data from database by removing the password
            req.user = await userModel.findOne({id: decoded.id}).select('-password');

            next();
        }
        catch(err)
        {
            res.status(403);
            throw new Error('Not authorized no token')
        }
    }

    if(!token) {
        res.status(401);
        throw new Error('No token')
    }
})

export default protect;