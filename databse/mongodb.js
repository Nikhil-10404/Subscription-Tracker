import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error('Please efine DB_URI envoirment variable inside .env.dev.<development/production>.local ')
}

const connectToDatabase = async()=>{
    try{
        await mongoose.connect(DB_URI);
        console.log(`connected to databse in ${NODE_ENV} MODE`);
    }
    catch(error){
        console.error('error connecting to the database: ', error);
        process.exit(1);

    }
}

export default connectToDatabase;