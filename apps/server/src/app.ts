import express, { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './modules';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev') as RequestHandler);

app.use("/api/v1", router)
// Routes
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Micro-Commerce-App Server v1' });
});

app.get('/api/v1/healthz', (req: Request, res: Response) => {
  res.json({ message: 'System running smoothly', environment: process.env.NODE_ENV, port: process.env.PORT || 3000 });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
