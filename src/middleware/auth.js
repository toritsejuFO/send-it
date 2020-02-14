import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
  const token = req.header('x-api-token');

  if (!token) {
    return res.status(401)
      .json({
        status: 401,
        error: 'API Token is not provided',
      });
  }

  // asyncErrors middleware catches vrification failures
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  req.user = decoded;
  return next();
};

export const adminAuth = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403)
      .json({
        status: 403,
        error: 'Unathorized user action',
      });
  }
  return next();
};
