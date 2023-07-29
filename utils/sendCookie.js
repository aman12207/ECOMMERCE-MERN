const sendCookie = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'none', // Set sameSite to 'none' for cross-origin requests
    secure: true, // Set secure to true for HTTPS
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendCookie;
