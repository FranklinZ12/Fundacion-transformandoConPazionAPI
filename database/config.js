import mongoose from 'mongoose';

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Database connected');
    } catch (error) {
        console.log(error);
        throw new Error('Error in connecting to database');
    }
}

export default dbConnection;