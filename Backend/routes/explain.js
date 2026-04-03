import express from 'express';
import { buildPrompt } from '../utils/promptBuilder.js';
import { generateAIExplanation } from '../services/huggingfaceService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Validate Input
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Missing input data in request body' });
    }

    // 1. Build structured prompt
    const prompt = buildPrompt(data);

    // 2. Query Hugging Face API
    const explanation = await generateAIExplanation(prompt);

    // 3. Return successful response
    return res.status(200).json({ explanation });

  } catch (error) {
    if (error.message === 'TIMEOUT' || error.code === 'ECONNABORTED') {
       return res.status(503).json({ 
           error: 'API Timeout', 
           explanation: 'Unable to generate AI explanation at the moment. Please consult a doctor.' 
       });
    }

    // Generic Fallback
    console.error('Explanation Route Error:', error.message);
    return res.status(500).json({ 
       error: 'Internal Server Error',
       explanation: 'Unable to generate AI explanation at the moment. Please consult a doctor.' 
    });
  }
});

export default router;
