const signToken = require('../utils/signToken');

module.exports = (user, statusCode, res) => {
  const token = signToken(user._id);

  //Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};
