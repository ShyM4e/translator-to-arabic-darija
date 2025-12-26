import './env-loader.js'; 

import express from 'express';
import cors from 'cors';

import translationRoutes from './src/routes/translation.route.js';
import basicAuth from './src/middlware/basicAuth.js';
import { errorHandler, notFoundHandler } from './src/middlware/error.handler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Protect all /api routes with HTTP Basic Auth
app.use('/api', basicAuth, translationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('*********************************');
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/translate`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Model: Google Gemini 2.5 Flash`);
  console.log('*********************************');
});

export default app;