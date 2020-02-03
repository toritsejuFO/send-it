import User from './usersModel';

export default class UsersService {
  static signup = async (newUser) => {
    const user = new User();
    await user.create(newUser);
    if (user.getError()) {
      console.log(user.getErrorStack());
      throw new Error('Unable to signup new user');
    }
    return user.getDetails();
  }

  static exists = async (email) => {
    const user = new User();
    await user.exists(email);
    if (user.getError()) {
      console.log(user.getErrorStack());
      throw new Error('Unable to verify if user with this email exists');
    }
    return user.getCount();
  }
}
