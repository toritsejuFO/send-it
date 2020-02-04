import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../users/usersModel';

export default class UsersService {
  static signup = async (newUser) => {
    const user = new User();
    await user.create(newUser);
    if (user.getError()) {
      console.log(user.getErrorStack());
      throw new Error('Unable to signup new user');
    }
    const userDetails = user.getDetails()[0];
    delete userDetails.password;
    return userDetails;
  }

  static hashPassword = async (password) => {
    const saltRounds = 2; // use low salt round for reducing running time cost
    return bcrypt.hash(password, saltRounds);
  }

  static generateToken = (payload) => {
    try {
      return jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '24h',
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
