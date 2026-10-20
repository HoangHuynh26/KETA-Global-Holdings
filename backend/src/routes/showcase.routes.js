import { Router } from 'express';
import { 
  getShowcase, 
  saveShowcase, 
  uploadImage, 
  resetShowcase 
} from '../controllers/showcase.controller.js';

const router = Router();

router.get('/', getShowcase);
router.post('/', saveShowcase);
router.post('/upload', uploadImage);
router.post('/reset', resetShowcase);

export default router;
