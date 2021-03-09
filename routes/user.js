const express = require('express');
const router = express.Router();

const {signup, kycController, login, get2FA, updatePassword, resetPassword, validate2FAtoken} = require(`../controllers/account`);
const { catchErrors } = require(`../helpers`);
const { Authenticate } = require('../middlewares/auth');

router.post(
    `/signup`,
    catchErrors(signup)
)

router.post(`/login`,catchErrors(login))

router.route(`/verify`)
      .get(catchErrors(get2FA))

router
    .route(`/kyc`)
    .get(catchErrors(kycController))

router
    .route(`/password-update`)
    .post(Authenticate,updatePassword)

router
    .route(`/password-reset`)
    .post(resetPassword)

router
    .route(`two-fa`)
    .post(validate2FAtoken)
    .get(get2FA)

module.exports = router; 