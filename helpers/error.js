class GeneralError extends Error {
    constructor(message,data) {
      super();
      this.message = message;
      this.status = data;
    }
  
    getCode() {
      if (this instanceof BadRequest) {
        return 400;
      } if (this instanceof NotFound) {
        return 404;
      } if (this instanceof Forbidden) {
        return 403;
      }
      return 500;
    }
  }
  
  class BadRequest extends GeneralError { }
  class NotFound extends GeneralError { }
  class Forbidden extends GeneralError { }
  
  module.exports = {
    GeneralError,
    BadRequest,
    NotFound,
    Forbidden
  };