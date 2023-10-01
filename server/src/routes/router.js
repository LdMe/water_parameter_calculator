import {Router } from 'express';

import userRouter from './userRouter.js';
import authRouter from './authRouter.js';
import parameterRouter from './parameterRouter.js';
import measurementRouter from './measurementRouter.js';
import locationRouter from './locationRouter.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/parameters',authMiddleware, parameterRouter);
router.use('/measurements',authMiddleware, measurementRouter);
router.use('/locations',authMiddleware, locationRouter);
export default router;