import { getGeminiModel } from '../config/gemini.js';

class TranslationService {
  async translateToDarija(text) {
    try {
      console.log('Starting translation...');
      console.log('Input text:', text);
      
      const model = getGeminiModel();
      console.log('Model retrieved');

      // Get the base prompt from environment variable
      const basePrompt = process.env.TEXT_TRANSLATION_PROMPT;

      // Build the full prompt with the text
      const prompt = `${basePrompt}

          text: "${text}"

          Darija translation:`;

      console.log('Sending to Gemini API...');
      const result = await model.generateContent(prompt);
      console.log('Response received:', result);
      
      const response = await result.response;
      console.log('Response text:', response);
      
      const translation = response.text().trim();
      console.log('Translation successful:', translation);

      return translation;

    } catch (error) {
      console.error('DETAILED ERROR:');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
      console.error('Error stack:', error.stack);
      
      throw new Error('Failed to translate text using Gemini API');
    }
  }
  
  validateText(text) {
    if (!text || typeof text !== 'string') {
      return false;
    }
    if (text.trim().length === 0) {
      return false;
    }
    if (text.length > 5000) {
      return false;
    }
    return true;
  }
  
  async translateImageToDarija(imageBuffer) {
    try {
      console.log("Starting image translation...");

      const model = getGeminiModel();

      // Get the prompt from environment variable
      const prompt = process.env.IMAGE_TRANSLATION_PROMPT;

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "image/png",
            data: imageBuffer.toString("base64"),
          },
        },
        { text: prompt },
      ]);

      const response = await result.response;
      const translation = response.text().trim();

      console.log("Image translation successful:", translation);
      return translation;

    } catch (error) {
      console.error("ERROR IMAGE OCR:", error);
      throw new Error("Failed to translate image");
    }
  }

}

export default new TranslationService();