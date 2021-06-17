const express = require('express');
const router = express.Router();

const { transactionInit, psWebhook } = require('../controllers/paystack');
const { catchErrors } = require('../helpers');
const { Authenticate, check2fa, paystackVerify } = require(`../middlewares/auth`);
const validator = require('express-joi-validation').createValidator({});
const { cardSchema } = require('../schemas');

router
    .route(`/create-charge`)
    .post(catchErrors(Authenticate), catchErrors(transactionInit))

router
    .route(`/webhook`)
    .post(catchErrors(paystackVerify),
        catchErrors(psWebhook))

module.exports = router;