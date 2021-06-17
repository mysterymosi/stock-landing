'use strict';
const Joi = require('joi').extend(require('@joi/date'));;

const registerSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(30)
        .trim()
        .required(),
    lastName: Joi.string()
        .min(2)
        .max(30)
        .trim()
        .required(),
    middleName: Joi.string()
        .min(2)
        .max(30)
        .trim(),
    mobileNumber: Joi.string()
        .min(2)
        .max(30)
        .trim()
        .required(),
    gender: Joi.string()
        .min(2)
        .max(30)
        .trim()
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .trim()
        .required(),
    dob: Joi.date().format('YYYY-MM-DD').raw()
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .trim()
        .required(),
    repeat_password: Joi.ref('password')
}).with('password', 'repeat_password');

const loginSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .trim()
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .trim()
        .required()
});

const resetPasswordSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .trim()
        .required(), 
    repeat_password: Joi.ref('password'),
    verificationCode: Joi.string()
        .pattern(new RegExp('^[0-9]*$'))
        .trim()
        .required(),
    mobileNumber: Joi.string()
        .pattern(new RegExp('/\^/+[1-9]\d{1,14}$'))
        .trim()
        .required()
}).with('password', 'repeat_password');

module.exports = {
    registerSchema,
    loginSchema,
    resetPasswordSchema
}