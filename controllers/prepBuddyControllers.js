import * as prepBuddyService from '../services/prepBuddyServices.js';
import { setError, setResponse } from '../utils/common.js';
import generateToken from '../utils/generateToken.js';
import path from 'path';
// @description registering a user
// @route /SignUp
// public
export const userRegistration = async (req, res) => {
    try {
        // returns the userdata from database using email
        const validUser = await prepBuddyService.getByEmail(req.body);
        if (validUser) {
            throw { code: 409, message: `User with email: ${req.body.email} already exists` };
        }
        const saveUser = await prepBuddyService.post(req.body);
        //Sends an email to user for verification purpose
        prepBuddyService.sendUserVerficationEmail(req.body , res); 
        setResponse(saveUser, res, 201)
    } catch (err) {
        res.status(err.code ? err.code : 500).send({ message: err.message ? err.message : "Something went wrong in SignUp!" })
    }
}


// @description Authentication of a user
// @route /Login
// public
export const authenticateUser = async (req, res) => {
    let statusCode;
    try {
        // returns the userdata from database using email
        const validUser = await prepBuddyService.getByEmail(req.body);
        // Validates the user with thier respective credentials
        if (validUser && await prepBuddyService.passwordMatch(req.body, validUser)) {
            //If the email is not verified user will not be able to login
            if(validUser.verified)
            {
                res.json({
                    id: validUser.id,
                    firstName: validUser.firstName,
                    lastName: validUser.lastName,
                    email: validUser.email,
                    token: generateToken(validUser.id)
                })
                res.status(201);
            }
            else
            {
                //console.log(`${validUser.email} is not verified`);
                statusCode = 401;
                throw { code: 401, message: 'Email is not verified' };
            }
            
        }
        else {
            statusCode = 401;
            throw { code: 401, message: 'Invalid Email or Password' };
        }
    } catch (err) {
        //console.log("error: ", err);
        res.status(err.code ? err.code : 500).send({ message: err.message ? err.message : "Something went wrong in Login!" })
    }
}

// @description Email verification of a user
// @route Email link
// private
export const validateUser = async (req, res) => {
    let {userId} = req.params;
    try{
        // User email verification
        await prepBuddyService.userVerfication(userId , req, res);
    }
    catch(err)
    {
        //console.log(err);
    }
}

