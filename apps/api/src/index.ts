import express from 'express';
import { auth } from './auth/auth';
import dotenv from 'dotenv';
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Better Auth must receive the raw request body and handle every auth sub-route.
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json({ limit: '10mb' }));

import welcomeRouter from './routes/welcome';
import newsRouter from './routes/news';
import contactsRouter from './routes/contacts';
import galleryRouter from './routes/gallery';
import usersRouter from './routes/users';
import carouselRouter from './routes/carousel';

// App routes
app.use('/api/v1/welcome-message', welcomeRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/contacts', contactsRouter);
app.use('/api/v1/gallery', galleryRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/carousel', carouselRouter);

// Basic healthcheck
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
