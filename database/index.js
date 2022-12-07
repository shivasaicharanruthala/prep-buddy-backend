import mongoose from 'mongoose';
import * as dotenv from 'dotenv'

dotenv.config() // setup .env file

// function connectMongo is to connect to MongoDB given the connection string and return the database object.
const connectMongo = async () => {
    return await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
}

export default connectMongo;
