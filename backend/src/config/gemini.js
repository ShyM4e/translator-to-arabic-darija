import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('GEMINI CONFIG LOADING...');
console.log('API Key value:', process.env.GEMINI_API_KEY);
console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
console.log('API Key length:', process.env.GEMINI_API_KEY?.length);

// Initialize Gemini AI Object
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiModel = () => {
  console.log('Getting Gemini model...');
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash' 
  });
  console.log('Model created:', model);
  return model;
};