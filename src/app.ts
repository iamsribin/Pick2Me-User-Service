import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from '@/routes/authRouter';
import { userRouter } from '@/routes/userRouter';
import { errorHandler } from '@Pick2Me/shared';
import { adminRoute } from '@/routes/adminRoutes';
import pino from 'pino';
import expressPino from 'express-pino-logger';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      singleLine: true,
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

const app = express();

app.use(expressPino({ logger: logger as any }));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', userRouter);
app.use('/admin', adminRoute);

app.use(errorHandler);

export default app;
