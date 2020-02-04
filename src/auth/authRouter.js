import { Router } from 'express';
import AuthController from './authController';
import validate from './authSchema';

const AuthRouter = Router();

AuthRouter.post('/signup', validate.signupDetails, AuthController.signup);

export default AuthRouter;
