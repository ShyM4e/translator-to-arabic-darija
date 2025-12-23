import dotenv from 'dotenv';

console.log('Loading .env file...');
const result = dotenv.config();

if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('.env loaded successfully');
  console.log('Loaded variables:', Object.keys(result.parsed || {}));
}

console.log('API_KEY from env:', process.env.GEMINI_API_KEY ? '✅ Present' : '❌ Missing');