/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';

export default {
  createParcelSchema: [
    body('weight')
      .exists().withMessage('weight is required').bail()
      .not().isEmpty().withMessage('weight cannot be empty').bail()
      .isFloat().withMessage('weight can only be a number').bail(),
    body('weightmetric')
      .exists().withMessage('weightmetric is required').bail()
      .not().isEmpty().withMessage('weightmetric cannot be empty').bail()
      .isIn(['lb', 'kg', 't']).withMessage('invalid weightmetric type').bail(),
    body('from')
      .exists().withMessage('from address is required').bail()
      .not().isEmpty().withMessage('from address cannot be empty').bail(),
    body('to')
      .exists().withMessage('to address is required').bail()
      .not().isEmpty().withMessage('to address cannot be empty').bail(),
  ],
};
