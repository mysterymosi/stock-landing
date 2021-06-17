const { sendJSONResponse, validatePassword, setUnixTimeDays } = require('../../helpers');
const { BadRequest, Forbidden } = require('../../helpers/error');
const models = require('../../database/models/index');
const jwt = require("jsonwebtoken");
const client = require("../../redisDb");
const { v4: uuidv4 } = require('uuid');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, VERIFICATION_SID } = process.env;
const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

exports.signup = async function (req, res) {
    const { email, mobileNumber, firstName, lastName, middleName, gender, dob, password } = req.body;
    const isUserRegistered = await models.user.findOne({
        where: {
            [models.Sequelize.Op.or]: [
                { email: email },
                { mobileNumber: mobileNumber }
            ]
        }
    });
    if (isUserRegistered) {
        throw new Forbidden(`${email || ''} / ${mobileNumber || ''} already exists`, req.body);
    }

    let result;
    result = await models.sequelize.transaction(async (t) => {
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

        let uid = uuidv4();

        await models.sequelize.query(`INSERT INTO points ("uid","userId","createdAt","updatedAt")VALUES ('${uid}','${user.dataValues.uid}','${createDate()}','${createDate()}')`, { transaction: t })

        return user;
    })

    const token = jwt.sign({
        firstName: result.dataValues.firstName,
        email: result.dataValues.email,
        mobileNumber: result.dataValues.mobileNumber,
        uid: result.dataValues.uid
    }, process.env.JWTSECRET, {
        expiresIn: "30d"
    });
    const data = {
        firstName,
        mobileNumber,
        email,
        token: token
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

exports.login = async function (req, res) {
    if (!req.body) {
        throw new BadRequest(`body is empty`, req.body);
    }
    const { email, password } = req.body;

    const user = await models.user.findOne({
        where: {
            email: email
        }
    });

    if (!user) {
        throw new BadRequest(`data does not match any existing user`, req.body);
    }

    const isPasswordValid = await validatePassword(password, user.dataValues.password);

    if (!isPasswordValid) {
        throw new BadRequest(`invalid password`, req.body);
    }

    const token = jwt.sign({
        firstName: user.dataValues.firstName,
        email: user.dataValues.email,
        mobileNumber: user.dataValues.mobileNumber,
        uid: user.dataValues.uid
    }, process.env.JWTSECRET, {
        expiresIn: "30d"
    });
    const data = {
        firstName:user.dataValues.firstName,
        mobileNumber:user.dataValues.mobileNumber,
        email:user.dataValues.email,
        token: token
    };

    return sendJSONResponse(res, 200, {
        message: 'Login successfull',
        status: true,
        data
    });
}

exports.get2FA = async function (req, res) {
    const channel = req.body.verificationMethod;

    //set up rate limiting for phone numbers with twilio
    //create a kwy to rate limit against
    // const rateLimit = await twilio.verify.services(VERIFICATION_SID)
    //     .rateLimits
    //     .create({
    //         description: 'Limit verifications by End User Phone Number',
    //         uniqueName: 'mobile_number'
    //     });

    // //The Service Rate Limit Bucket resource defines the limit that should be enforced against the key it is associated with.
    // await twilio.verify.services(VERIFICATION_SID)
    //     .rateLimits(rateLimit.sid)
    //     .buckets
    //     .create({ max: 4, interval: 60 });

    //To use the Rate Limits we need to update the request that starts phone verifications to include the values we want to limit. To do this we will add the new `RateLimit` parameter to our request
    verificationRequest = await twilio.verify.services(VERIFICATION_SID)
        .verifications
        .create({
            rateLimits: {
                mobile_number: req.body.mobileNumber
            }, to: req.body.mobileNumber,channel});

    data = {
        lookup: verificationRequest.lookup,
        to: verificationRequest.to,
        channel: verificationRequest.channel
    }
    if (verificationRequest.status != 'pending') {
        console.log(verificationRequest)
        return sendJSONResponse(res, 400, {
            message: verificationRequest.status,
            status: false,
            data
        });
    }

    return sendJSONResponse(res, 200, {
        message: verificationRequest.status,
        status: true,
        data
    });
}

exports.validate2FAtoken = async (req, res) => {
    const { verificationCode: code } = req.body;
    const {decoded} = req.decoded;
    let verificationResult;
    verificationResult = await twilio.verify.services(VERIFICATION_SID)
        .verificationChecks
        .create({ code, to: req.body.mobileNumber });

    if (verificationResult.status === 'approved') {
        let data = {};
        const cacheJwt = {
            twoFa: true
        }
        let expDay = setUnixTimeDays(7);
        //set the redis hash and expiry time
        client.hmsetAsync(decoded.uid, cacheJwt)
            .then(data => {
                console.log(data);
                client.expire(decoded.uid, expDay);
            }); //does redis return values on failed or successful set?    
        return sendJSONResponse(res, 200, {
            message: verificationRequest.status,
            status: true,
            data
        });
    } else {
        throw new BadRequest(`Unable to verify code. status: ${verificationResult.status}`, req.body);
    }
}

module.exports.resetPassword = async function (req, res) {
    //create joi valdation for reset password
    //validate mobile number and password
    const { password, mobileNumber, verificationCode: code } = req.body;
    let verificationResult;
    verificationResult = await twilio.verify.services(VERIFICATION_SID)
        .verificationChecks
        .create({ code, to: req.body.mobileNumber });

    if (verificationResult.status != 'approved') {
        throw new BadRequest(`Unable to verify code. status: ${verificationResult.status}`, req.body);
    }
    const userIsRegistered = await models.user.findOne({
        where: {
            mobileNumber
        }
    });
    if (!userIsRegistered) {
        throw new BadRequest(`data does not match any existing user`, req.body);
    }
    const resetPassword = await userIsRegistered.update({
        password: password
    }, {
        where: {
            mobileNumber
        }
    });

    if (!resetPassword) {
        throw new BadRequest(`password field empty`, req.body);
    }
    const data = {};
    return sendJSONResponse(res, 200, {
        message: 'Password reset was successfull',
        status: true,
        data
    });
};

module.exports.updatePassword = async (req, res) => {
    const { oldPassword, password } = req.body;
    const userIsRegistered = await models.user.findOne({
        where: {
            uid: req.decoded.uid
        }
    });
    if (!userIsRegistered) {
        throw new BadRequest(`data does not match any existing user`, req.body);
    }
    const ValidatePassword = await validatePassword(oldPassword, userIsRegistered.dataValues.password);
    if (!ValidatePassword) {
        throw new BadRequest(`password does not match`, req.body);
    }
    const resetPassword = await userIsRegistered.update({
        password: password
    }, {
        where: {
            uid: userIsRegistered.uid
        }
    });
    if (!resetPassword) {
        throw new BadRequest(`password update failed`, req.body);
    }
    const data = {};
    return sendJSONResponse(res, 200, {
        message: `Dear ${userIsRegistered.firstName}, your password update was successfull`,
        status: true,
        data
    });
};

function createDate() {
    let date = new Date();

    return date.toISOString().slice(0,19).replace('T',' ');
}
