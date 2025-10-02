import express, { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import router from './modules';
import passport from './config/passport';
import { errorHandler } from './middleware/error-handler';
import { morganMiddleware } from './middleware/logger';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morganMiddleware);
app.use(passport.initialize());

app.use("/api/v1", router)
// Routes
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Micro-Commerce-App Server v1' });
});

app.get('/api/v1/healthz', (req: Request, res: Response) => {
  res.json({ message: 'System running smoothly', environment: process.env.NODE_ENV, port: process.env.PORT || 3000 });
});

// Error handler
app.use(errorHandler);

export default app;
