import translationService from '../services/translation.services.js';

class TranslationController {
  
  async translate(req, res, next) {
    try {
      const { text } = req.body;

      if (!translationService.validateText(text)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          message: 'Please provide valid text (max 5000 characters)'
        });
      }

      const translation = await translationService.translateToDarija(text);

      res.json({
        success: true,
        original: text,
        translation: translation,
        model: 'Google Gemini Pro',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      next(error); // to error handler middleware
    }
  }

  healthCheck(req, res) {
    res.json({
      status: 'OK',
      message: 'Translation service is running',
      model: 'Google Gemini Pro',
      timestamp: new Date().toISOString()
    });
  }
  async translateImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an image"
        });
      }

      const translation = await translationService.translateImageToDarija(
        req.file.buffer
      );

      res.json({
        success: true,
        translation,
        model: "Gemini Vision",
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new TranslationController();