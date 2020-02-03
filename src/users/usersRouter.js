import { Router } from 'express';
import UsersController from './usersController';

const usersRouter = Router();

usersRouter.post('/', UsersController.signup);

export default usersRouter;
