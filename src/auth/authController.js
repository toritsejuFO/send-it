import { validationResult } from 'express-validator';
import UsersService from '../users/usersService';
import AuthService from './authService';

export default class UsersController {
  static signup = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        error: errors.errors[0].msg,
      });
    }

    const { body } = req;
    const newUser = {};
    newUser.firstname = UsersService.capitalize(body.firstname);
    newUser.lastname = UsersService.capitalize(body.lastname);
    newUser.othernames = UsersService.capitalize(body.othernames);
    newUser.email = body.email;
    newUser.username = body.username;
    newUser.password = await AuthService.hashPassword(body.password);
    newUser.isadmin = body.isAdmin || false;
    newUser.phone = body.phone || false;

    if (await UsersService.exists({ email: newUser.email })) {
      return res.status(409).json({
        status: 409,
        error: 'User with this email already exists',
      });
    }

    if (await UsersService.exists({ username: newUser.username })) {
      return res.status(409).json({
        status: 409,
        error: 'User with this username already exists',
      });
    }

    const signedupUser = await AuthService.signup(newUser);
    const token = AuthService.generateToken({
      email: newUser.email,
      username: newUser.username,
      isAdmin: newUser.isAdmin,
    });

    return res.status(201).json({
      status: 201,
      data: [{
        user: signedupUser,
        token,
      }],
    });
  }
}
