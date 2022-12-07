import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config({path: '../.env'});

// Generates JWT token for each ID which expires in 1h
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export default generateToken;