import bcrypt from 'bcrypt';
import User from './usersModel';

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

  static exists = async (details) => {
    const user = new User();
    await user.exists(details);
    if (user.getError()) {
      console.log(user.getErrorStack());
      throw new Error('Unable to verify if user with this email exists');
    }
    return user.getCount();
  }

  static capitalize = (data) => `${data[0].toUpperCase()}${data.slice(1)}`

  static hashPassword = async (password) => {
    const saltRounds = 2; // use low salt round for reducing running time cost
    return bcrypt.hash(password, saltRounds);
  }
}
