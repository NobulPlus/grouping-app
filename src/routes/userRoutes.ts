import { Router } from 'express';
import { body, query } from 'express-validator';
import userController from '../controllers/userController';

const router = Router();

// Validation middleware
const registerValidation = [
  body('surname')
    .trim()
    .notEmpty().withMessage('Surname is required')
    .isLength({ max: 50 }).withMessage('Surname cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Surname can only contain letters and spaces'),
  
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters and spaces'),
  
  body('middleName')
    .trim()
    .notEmpty().withMessage('Middle name is required')
    .isLength({ max: 50 }).withMessage('Middle name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Middle name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Please enter a valid phone number')
];

// Routes
router.post('/register', ...registerValidation, userController.registerUser);
router.get('/check', 
  query('surname').notEmpty(),
  query('firstName').notEmpty(),
  query('middleName').notEmpty(),
  userController.checkNameExists
);
router.get('/stats', userController.getStats);
router.get('/:id', userController.getUser);
router.get('/group/:groupId/members', userController.getGroupMembers);

export default router;