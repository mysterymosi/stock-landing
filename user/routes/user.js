const express = require('express');
const router = express.Router();

const { signup, kycController, login, get2FA, updatePassword, resetPassword, validate2FAtoken } = require(`../controllers/account`);
const { catchErrors } = require(`../helpers`);
const { Authenticate, check2fa } = require('../middlewares/auth');
const validator = require('express-joi-validation').createValidator({})
const { loginSchema, registerSchema,resetPasswordSchema } = require(`../schemas`)

router.post(
    `/signup`,
    validator.body(registerSchema),
    catchErrors(signup)
)

router.post(`/login`,
    validator.body(loginSchema),
    check2fa,
    catchErrors(login))

router
    .route(`/password-update`)
    .post(Authenticate, catchErrors(updatePassword))

router
    .route(`/password-reset`)
    .post(validator.body(resetPasswordSchema),catchErrors(resetPassword))

router
    .route(`/two-fa`)
    .post(Authenticate,catchErrors(validate2FAtoken))
    .get(Authenticate,catchErrors(get2FA))

module.exports = router;