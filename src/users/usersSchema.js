/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';
import { isBoolean } from 'util';

const len = 50;
const emailLength = 128;
const phoneLength = 15;

export default {
  signupDetails: [
    body('firstname')
      .exists().withMessage('firtsname is required').bail()
      .not().isEmpty().withMessage('firstname cannot be empty').bail()
      .isLength({ min: 1, max: len }).withMessage(`firstname cannot exceed ${len} characters`).bail(),
    body('lastname')
      .exists().withMessage('lastname is required').bail()
      .not().isEmpty().withMessage('lastname cannot be empty').bail()
      .isLength({ min: 1, max: len }).withMessage(`lastname cannot exceed ${len} characters`).bail(),
    body('othernames')
      .optional()
      .isLength({ min: 1, max: len }).withMessage(`othernames cannot exceed ${len} characters`).bail(),
    body('email')
      .exists().withMessage('email is required').bail()
      .not().isEmpty().withMessage('email cannot be empty').bail()
      .isLength({ min: 1, max: emailLength }).withMessage(`emial cannot exceed ${emailLength} characters`).bail()
      .isEmail().withMessage('Invalid email format').bail(),
    body('username')
      .exists().withMessage('username is required').bail()
      .not().isEmpty().withMessage('username cannot be empty').bail()
      .isLength({ min: 1, max: len }).withMessage(`othernames cannot exceed ${len} characters`).bail(),
    body('isAdmin')
      .optional()
      .isBoolean().withMessage('isAdmin is either true or false. Defaults to false'),
    body('phone')
      .exists().withMessage('phone is required').bail()
      .not().isEmpty().withMessage('phone cannot be empty').bail()
      .isLength({ min: 1, max: phoneLength }).withMessage(`phone cannot exceed ${phoneLength} characters`).bail()
      .isMobilePhone().withMessage('phone must be a phone number').bail(),
    body('password')
      .exists().withMessage('password is required').bail()
      .not().isEmpty().withMessage('password cannot be ull').bail()
      .isLength({ min: 6 }).withMessage('password must be at least 6 characters').bail()
      .matches(/[a-z]+/).withMessage('password must contain at least 1 lowercase letter').bail()
      .matches(/[A-Z]+/).withMessage('password must contain at least 1 uppercase letter').bail()
      .matches(/[0-9]+/).withMessage('password must contain at least 1 number').bail()
      .matches(/[!@#$%^&*]+/).withMessage('password must contain at least 1 symbol').bail(),
  ],
};
