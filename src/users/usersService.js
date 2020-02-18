import logger from '../../logger';
import User from './usersModel';

const { errorLogger } = logger;

export default class UsersService {
  static create = async (newUser) => {
    const user = new User();
    await user.create(newUser);
    if (user.hasError()) {
      errorLogger.error(user.getErrorStack(), { file: __filename });
      throw new Error('Unable to signup new user');
    }
    const userDetails = user.getDetails()[0];
    delete userDetails.password;
    return userDetails;
  }


  static findByEmailOrUsername = async (userId) => {
    const user = new User();

    // Find existing user by email
    await user.findByEmail(userId);
    if (user.hasError()) {
      errorLogger.error(user.getErrorStack(), { file: __filename });
      throw new Error('Unable to login user');
    }

    // Or by username
    if (!user.getCount()) {
      await user.findByUsername(userId);
      if (user.hasError()) {
        errorLogger.error(user.getErrorStack(), { file: __filename });
        throw new Error('Unable to login user');
      }
    }

    // If user not found
    if (!user.getCount()) {
      return false;
    }

    // If found
    return user.getDetails()[0];
  }


  static exists = async (details) => {
    const user = new User();
    await user.exists(details);
    if (user.hasError()) {
      errorLogger.error(user.getErrorStack(), { file: __filename });
      throw new Error('Unable to verify if user with this email exists');
    }
    return user.getCount();
  }

  static capitalize = (data) => (data ? `${data[0].toUpperCase()}${data.slice(1)}` : '')
}
