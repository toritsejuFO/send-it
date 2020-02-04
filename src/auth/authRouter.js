import { Router } from 'express';
import UsersController from './usersController';
import validate from './usersSchema';

const usersRouter = Router();

usersRouter.post('/', validate.signupDetails, UsersController.signup);

export default usersRouter;
