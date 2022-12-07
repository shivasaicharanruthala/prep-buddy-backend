import { v4 as uuid4 } from 'uuid';
import transporter from './userValidationServices.js';
import userModel from '../models/prepBuddy.users.models.js';
import PrepBuddyUsersModels from "../models/prepBuddy.users.models.js";
import userValidation from '../models/prepBuddy.userValidation.models.js';

// returns userdata from database by searching with email
export const getByEmail = async (userformData) => {
    return await userModel.findOne({ "email": userformData.email }).exec();
}

// returns userdata from database by searching with Id
export const getById = async (user) => {
    return await userModel.findOne({ id: user.id });
}

// Sends an verification email to user's email address
export const sendUserVerficationEmail = async (userformdata, res) => {
    const userStatus = await getByEmail(userformdata);
    const currentURL = 'http://localhost:8080/';
    const uniqueString = userStatus.id;

    // Email format which will be sent to user for verification purpose
    const mailOptions = {
        from: 'testemail9121@gmail.com',
        to: userStatus.email,
        subject: 'PrepBuddy Please Verify your email',
        html: `<p>Hi ${userStatus.firstName},<p/><br><p>Please verify your email address to complete the signup and login into your account.<p/>
            <p><b>This link is valid only for 10 mins <b/>.</p>
            <p>Press click<a href=${currentURL + "user/" + userStatus.id + "/verify"}> here <a/> to proceed<p/>`,

    };

    // User is created in userValidation database with an expiry time of 10 mins
    const newVerification = new userValidation({
        userId: uniqueString,
        email: userStatus.email,
        uniqueString: uniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000
    })
    //New User created in verification table
    newVerification.save()
        .then(() => {
            transporter.sendMail(mailOptions)
                .then(() => {
                })
                .catch((error) => {
                    ///console.log("Error in email sending ",error);
                })
        })
        .catch((error) => {
            //console.log("Error in savig into database",error);
        })
}

export const passwordMatch = async (userformData, validUser) => {
    return await validUser.matchPassword(userformData.password);
}

// Creates new user after successful signup
export const post = async (userformData) => {
    const user = {
        id: uuid4(),
        firstName: userformData.firstName,
        lastName: userformData.lastName,
        email: userformData.email,
        password: userformData.password,
        verified: false
    }
    const newUser = new userModel(user);
    return newUser.save();
}

// Verifies user email after clicking the link provided in the email before it expires
export const userVerfication = async (userId, req, res) => {
    userValidation.findOne({ "userId": userId }).then((userValidationRecord) => {
        if (userValidationRecord) {
            //Record fetched from uservalidation table
            const expiresAt = userValidationRecord.expiresAt;
            if (expiresAt < Date.now()) {
                //Record is expired
                userValidation.deleteOne({ "userId": userId }).then(result => {
                    userModel.deleteOne({ "id": userId }).then(() => {
                        let message = "Link has expired Please SignUp again";
                        res.redirect(`/user/verified/error=true&message=${message}`);
                    }).catch(() => {
                        let message = "Error occured while while deleting the existing user Model record";
                        res.redirect(`/user/verified/error=true&message=${message}`);
                    })
                })
                    .catch((err) => {
                        let message = "Error occured while deleting the existing user validation record";
                        res.redirect(`/user/verified/error=true&message=${message}`);
                    })
            }
            else {
                //Valid record Exists
                userModel.updateOne({ id: userId }, { verified: true })
                    .then(() => {
                        userValidation.deleteOne({ "userId": userId })
                            .then(() => {
                                //Send the verfied html file as status
                                res.sendFile("./verified.html");
                            })
                            .catch((err) => {
                                let message = "Error occured while finalizing successful record";
                                res.redirect(`/user/verified/error=true&message=${message}`);
                            })
                    })
                    .catch((err) => {
                        let message = "Error occured while updating user verification record";
                        res.redirect(`/user/verified/error=true&message=${message}`);
                    })
            }
        }
        else {
            let message = "User record doesn't exist or it has been verified already. Please signin or signup"
            res.redirect(`/user/verified/error=true&message=${message}`);
        }
    }).catch((err) => {
        let message = "Error occured while checking existing valid record";
        res.redirect(`/user/verified/error=true&message=${message}`);
    })
}

export const GetUserEmailsById = async (userId, interviewerId) => {
    return await PrepBuddyUsersModels.find( { $or: [{id: userId}, {id: interviewerId}] } ).select('email').exec()
}