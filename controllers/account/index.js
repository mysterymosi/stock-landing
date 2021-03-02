const { sendJSONResponse } = require('../../helpers');
const { BadRequest, Forbidden } = require('../../helpers/error');
const models = require('../../database/models/index');
const jwt = require("jsonwebtoken");

exports.signup = async function (req, res) {
    const { email, mobileNumber, firstName, lastName, middleName, gender, dob, password } = req.body;
    const isUserRegistered = await models.user.findOne({
        where: {
            [models.Sequelize.Op.or]: [
                { email: email },
                { phoneNumber: phoneNumber }
            ]
        }
    });
    if (isUserRegistered) {
        throw new Forbidden(`${email || ''} / ${mobileNumber || ''} already exists`, req.body);
    }

    const user = await models.user.create({
        email,
        firstName,
        mobileNumber,
        lastName,
        middleName,
        gender,
        dob,
        password
    });

    const token = jwt.sign({
        firstName: user.dataValues.firstName,
        email: user.dataValues.email,
        mobileNumber: user.dataValues.mobileNumber,
        uid: user.dataValues.uid
    }, process.env.SECRETKEY, {
        expiresIn: "30d"
    });
    const data = {
        firstName,
        mobileNumber,
        email,
        token:token
      };
      return sendJSONResponse(res, 200, {
        message: 'Registration successfull',
        status: true,
        data
      });
};


exports.kycController = async function (req, res) {
    return sendJSONResponse(res, 200, {
        message: "works",
        status: true,
    });
};