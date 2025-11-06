import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/authRouter';
import { userRouter } from './routes/userRouter';
import { errorHandler } from '@Pick2Me/shared';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', userRouter);

app.use(errorHandler);

export default app;
