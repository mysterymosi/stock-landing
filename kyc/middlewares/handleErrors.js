const { GeneralError } = require('../helpers/error');

const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: false,
      message: err.message,
      data: err.data
    });
  }

  return res.status(500).json({
    status: false,
    message: err.message,
    data: {}
  });
}

module.exports = {
  handleErrors
};