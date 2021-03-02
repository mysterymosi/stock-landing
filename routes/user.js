const express = require('express');
const router = express.Router();

const {signup, kycController} = require("../controllers/account");
const { catchErrors } = require('../helpers');

router.post(
    '/signup',
    catchErrors(signup)
)

router
    .route("/kyc")
    .get(catchErrors(kycController))

module.exports = router; 