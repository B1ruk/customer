const validator = require('validator');

exports.validateEmail = (email) => {
  return validator.isEmail(email);
};
