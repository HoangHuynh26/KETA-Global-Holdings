import { Router } from 'express';
import { createInquiry, healthCheck } from '../controllers/inquiry.controller.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/health', healthCheck);
router.post('/inquiries', inquiryLimiter, createInquiry);

export default router;
