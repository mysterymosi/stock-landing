const models = require(`../database/models/index`);
const jwt = require('jsonwebtoken');
const { Unauthorized, BadRequest } = require('../helpers/error');

const Authenticate = async(req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1];;
    if(!token) {
        throw new BadRequest(`token needed`, {});
    } else {
        jwt.verify(token, process.env.JWTSECRET,async (err, decoded) =>  {
            if (err) {
                throw new Unauthorized(`Unauthorized bad token`, {});
            } else {
                req.decoded = decoded;
                const user = await models.user.findOne({
                  where : {
                    uid: decoded.uid
                  }
                });
                console.log(user)
                req.user = user
                if(!user){
                    throw new BadRequest(`User does not exist`, req.body);
                }
                console.log(decoded);
                next();
            }
        })
    }
}
  
  module.exports = {
    Authenticate
  };