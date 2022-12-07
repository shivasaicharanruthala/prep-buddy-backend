import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const SALT_ROUNDS = 8;

// User Database schema
const schema = new mongoose.Schema(
    {
        id : {
            type : String,
            required: 'ID is required'
        },
        firstName:{
            type: String,
            required: 'firstName is required'
        },
        lastName:{
            type: String,
            required: 'lastName is required',
        },
        email:{
            type: String,
            required: 'email is required',
        },
        password:{
            type: String,
            required: 'password is required',
        },
        verified:{
            type: Boolean,
            required: 'Verfication is required'
        }
    },
    {timestamps: true}
)

// Encrypts the password in database before user is saved into the database
schema.pre("save",async function preSave(next) {
    const user = this
    if(!user.isModified('password')) {
        next();
    }

    try {
        // Encrypts the password with 8 salt rounds
        const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
        user.password = hash;
    } catch(err) {
        return next(err);
    }
  });

// Compares the password feild with user database
schema.methods.matchPassword = async function (user){
    return await bcrypt.compare(user , this.password);
}
const userModel = mongoose.model('users' , schema)

export default userModel;