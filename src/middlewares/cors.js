module.exports = (req, res, next) => {
  res.header("Content-Type", "application/json; charset=uft-8");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET, OPTIONS");

  next();
};
