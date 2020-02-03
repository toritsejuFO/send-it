import UsersService from './usersService';

export default class UsersController {
  static signup = async (req, res) => {
    const newUser = {};
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.othernames = req.body.othernames;
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.isadmin = req.body.isAdmin || false;
    newUser.phone = req.body.phone || false;

    if (await UsersService.exists(newUser.email)) {
      return res.status(409).json({
        status: 409,
        error: 'User with this email already exists',
      });
    }

    const signeupUser = await UsersService.signup(newUser);
    return res.status(201).json({
      status: 201,
      data: signeupUser,
    });
  }
}
