import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthService {
  static hashPassword = async (password) => {
    const saltRounds = 2; // use low salt round for reducing running time cost
    return bcrypt.hash(password, saltRounds);
  }


  static generateToken = async (payload) => {
    try {
      return jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '24h',
      });
    } catch (err) {
      throw new Error(err);
    }
  }


  static verifyPassword = async (plainPassword, hashedPassword) => (
    bcrypt.compare(plainPassword, hashedPassword)
  );
}
