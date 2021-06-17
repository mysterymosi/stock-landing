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
  },
  setUnixTimeDays(days) {
    const d = new Date();
  
    const unixTime = new Date().setTime((d.getTime() / 1000) + (86400 * days))
    return unixTime;
  }
};