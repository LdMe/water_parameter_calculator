import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const host ="mongo-color";
const port = 27017;
const database = "hydromnis";

const url = `mongodb://${host}:${port}/${database}`;

mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
}
).catch((err) => {
}
);

export default mongoose;
