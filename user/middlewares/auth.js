'use strict';
const jwt = require('jsonwebtoken');
const {client} = require(`../redisDb`);
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
                console.log(decoded);
                next();
            }
        })
    }
}

/*
? call this after authorization middleware as it requires the decoded uid from jwt token
*/
const check2fa = async(req,res,next)=>{
    const result = await client.hgetAsync(req.decoded.uid, 'twoFa');
    if(!result){
        let err =  new Unauthorized(`Unauthorzed no 2factor verification`, {});
        return next(err);
      }
    next()
}
  
  module.exports = {
    Authenticate,
    check2fa
  };