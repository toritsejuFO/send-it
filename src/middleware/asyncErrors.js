export default (err, _, res, next) => {
  res.status(500).json({
    status: 500,
    error: err.message,
  });
  next();
};
