const bcrypt = require("bcrypt");

module.exports = {
  sendJSONResponse(res, status, content) {
    res.status(status);
    res.json(content);
  },
   validatePassword(password, hash) {
     return bcrypt.compareSync(password, hash);
   },
  catchErrors(fn){
    return function (req, res, next) {
      return fn(req, res, next).catch(next);
    };
  }
};