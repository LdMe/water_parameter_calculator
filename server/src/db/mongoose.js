import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const host ="mongo-color";
const port = 27017;
const database = "blog";

const url = `mongodb://${host}:${port}/${database}`;

mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log('Connected to MongoDB');
}
).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
}
);

export default mongoose;
