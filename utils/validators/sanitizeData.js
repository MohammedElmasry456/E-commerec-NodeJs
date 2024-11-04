exports.sanitizeUser = function (user) {
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
  };
};
