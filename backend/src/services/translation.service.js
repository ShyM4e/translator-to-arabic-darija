import { getGeminiModel } from '../config/gemini.js';

class TranslationService {
  async translateToDarija(text) {
    try {
      console.log('Starting translation...');
      console.log('Input text:', text);
      
      const model = getGeminiModel();
      console.log('Model retrieved');

        const envPrompt = process.env.PROMPT_TEXT_TEMPLATE || '';
        const defaultPrompt = `Translate the following text to Darija (Moroccan Arabic dialect).\nOnly provide the Darija translation, nothing else. Use authentic Darija language and the writing should be in arabic letters.\n\ntext: "{TEXT}"\n\nDarija translation:`;
        const promptTemplate = envPrompt || defaultPrompt;
        const prompt = promptTemplate.replace('{TEXT}', text);

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

      const envImagePrompt = process.env.PROMPT_IMAGE_TEMPLATE || '';
      const defaultImagePrompt = `You are an OCR and translation assistant.\n1. Extract all readable text from the image.\n2. Translate that text to Moroccan Darija.\n3. Use Arabic letters only.\n4. Do NOT add explanations, ONLY the translation.`;
      const imagePrompt = envImagePrompt || defaultImagePrompt;

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "image/png",
            data: imageBuffer.toString("base64"),
          },
        },
        { text: imagePrompt },
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