const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const patientController = require('../controllers/patientController');
const authenticate = require('../middleware/auth');

const validatePatient = [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().withMessage('Valid email is required').notEmpty().withMessage('Email is required'),
  body('phone').notEmpty().withMessage('Phone number is required').isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters'),
  body('dob').notEmpty().withMessage('Date of birth is required').isISO8601().withMessage('Valid date format required (YYYY-MM-DD)'),
  body('medicalNotes').notEmpty().withMessage('Medical notes are required').isLength({ min: 5, max: 1000 }).withMessage('Medical notes must be between 5 and 1000 characters')
];

router.use(authenticate);

router.post('/', validatePatient, patientController.create);
router.get('/', patientController.getAll);
router.get('/:id', patientController.getById);
router.put('/:id', validatePatient, patientController.update);
router.delete('/:id', patientController.delete);

module.exports = router;
