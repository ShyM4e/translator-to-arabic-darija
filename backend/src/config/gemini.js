import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('GEMINI CONFIG LOADING...');

// Initialize Gemini AI Object
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to get Gemini Model instance
export const getGeminiModel = () => {
  console.log('Getting Gemini model...');
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash' 
  });
  console.log('Model created:', model);
  return model;
};