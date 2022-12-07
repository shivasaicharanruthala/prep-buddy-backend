import cors from 'cors';
import express from 'express';
import * as dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

import routes from './routes/index.js';           // imports routes
import connectMongo from "./database/index.js";  //  imports function to connect mongo DB.

dotenv.config() // setup .env config

const app = express();

// Adds all required middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

// Register all routes.
routes(app);

// connect to mongoDB.
connectMongo().then(() => {
    console.log("Connected to MongoDB!!!");
}).catch(err => {
    console.error("Error connecting to MongoDB: ", err);
    process.exit(0);
})

// Run the server
app.listen(process.env.PORT, () => { console.log(`server started on port ${process.env.PORT}`)});

export default app;
