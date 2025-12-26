import express from 'express';
import multer from "multer";
import translationController from '../controllers/translation.controller.js';

const router = express.Router();
const upload = multer();

// POST /api/translate - Translate text to DARIJA
router.post('/translate', (req, res, next) => {
  translationController.translate(req, res, next);
});

// GET /api/health - Health check
router.get('/health', (req, res) => {
  translationController.healthCheck(req, res);
});

// POST /api/translate-image - Translate text from image to DARIJA
router.post("/translate-image", upload.single("image"), translationController.translateImage);


export default router;