export default (err, _, res, next) => {
  console.log(err);
  res.json({
    status: 500,
    error: err.message,
  });
  next();
};
