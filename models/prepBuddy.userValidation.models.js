import mongoose, { Schema } from 'mongoose';
//This is a temporary schema for user email verification purpose
// To make sure users doesn't use same or expired link for email verification
const validationSchema = new Schema({
    userId : String,
    email : String,
    uniqueString : String,
    createdAt : Date,
    expiresAt : Date
});

const userValidation = mongoose.model('userValidation' , validationSchema);
export default userValidation;