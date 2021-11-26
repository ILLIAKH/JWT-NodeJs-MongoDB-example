//create a route that requires a user token in the header
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  //if token doesnt exist
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    //try to decode the jwt token using the secret
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;