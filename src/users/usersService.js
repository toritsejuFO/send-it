import User from './usersModel';

export default class UsersService {
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
}
