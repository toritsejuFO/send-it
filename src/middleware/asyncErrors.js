import logger from '../../logger';

const { errorLogger } = logger;

export default (err, _, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    errorLogger.error(err, { file: __filename });
  }

  res.status(500).json({
    status: 500,
    error: err.message,
  });
  next();
};
