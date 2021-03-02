const { GeneralError } = require('../helpers/error');

const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      message: err.message,
      data: err.data
    });
  }

  return res.status(500).json({
    status: 'error',
    message: err.message,
    data: err.data
  });
}


module.exports = handleErrors;