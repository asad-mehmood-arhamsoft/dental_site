const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const chatController = require('../controllers/chatController');
const authenticate = require('../middleware/auth');

const validateMessage = [
  body('patientId').isInt().withMessage('Valid patient ID is required'),
  body('message').notEmpty().withMessage('Message is required')
];

router.use(authenticate);

router.post('/', validateMessage, chatController.sendMessage);
router.get('/:patientId', chatController.getHistory);

module.exports = router;
