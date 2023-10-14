import express from 'express';

import router from './routes/router.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();




const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/', router);

app.listen(3000, () => {
    }
);
