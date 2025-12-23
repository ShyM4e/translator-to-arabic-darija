import './env-loader.js'; 

import express from 'express';
import cors from 'cors';

import translationRoutes from './src/routes/translation.routes.js';
import { errorHandler, notFoundHandler } from './src/middlware/error.handler.js';

const app = express();

app.use(cors({
  origin: '*'
}));
app.use(express.json());


app.use('/api', translationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('*********************************');
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/translate`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Model: Google Gemini 2.5 Flash`);
  console.log('*********************************');
});

export default app;