export default (err, _, res, next) => {
  console.log(err);
  res.status(500).json({
    status: 500,
    error: err.message,
  });
  next();
};
