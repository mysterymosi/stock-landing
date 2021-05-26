const express = require('express');
const router  = express.Router();

const {IDnumber}     = require(`../controllers`);
const {catchErrors}  = require(`../helpers`);
const {Authenticate} = require(`../middlewares/auth`);

router.put(`/id-number`,Authenticate,catchErrors(IDnumber));

module.exports = router;