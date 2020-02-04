import { validationResult } from 'express-validator';
import UsersService from '../users/usersService';
import AuthService from './authService';

export default class AuthController {
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
    newUser.email = body.email.toLowerCase();
    newUser.username = body.username.toLowerCase();
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

    const user = await UsersService.create(newUser);
    const token = await AuthService.generateToken({
      email: newUser.email,
      username: newUser.username,
      isAdmin: newUser.isAdmin,
    });

    return res.status(201).json({
      status: 201,
      data: [{ user, token }],
    });
  }


  static login = async (req, res) => {
    const { userId, password } = req.body;

    const user = await UsersService.findByEmailOrUsername(userId.toLowerCase());
    if (!user) {
      return res.status(401).send({
        status: 401,
        error: 'Invalid email/username or password',
      });
    }

    const passwordVerified = await AuthService.verifyPassword(password, user.password);
    if (!passwordVerified) {
      return res.status(401).send({
        status: 401,
        error: 'Invalid email/username or password',
      });
    }

    const token = await AuthService.generateToken({
      email: user.email,
      username: user.username,
      admin: user.isAdmin,
    });

    delete user.password;
    return res.status(200).json({
      status: 200,
      data: [{ user, token }],
    });
  }
}
