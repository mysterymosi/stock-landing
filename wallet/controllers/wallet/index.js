'use strict'
const { sendJSONResponse, toCents, toDollars } = require('../../helpers');
const { BadRequest, Forbidden } = require('../../helpers/error');
const models = require('../../database/models');

exports.create = async function (req, res) {
    const userId = req.decoded.uid;
    //user create a wallet 
    //check if user already has a wallet
    const walletExists = await models.wallet.findOne({
        where: {
            userId,
        }
    });
    console.log(walletExists)
    if (walletExists) {
        throw new Forbidden(`wallet already exists`, req.body);
    }

    const wallet = await models.wallet.create({
        userId,
    })
    const data = {
        wallId: wallet.dataValues.uid
    };
    return sendJSONResponse(res, 200, {
        message: 'Wallet created successfully',
        status: true,
        data
    });
};

exports.getWallet = async function (req,res) {
    const userId = req.decoded.uid;
    //user create a wallet 
    //check if user already has a wallet
    const wallet = await models.wallet.findOne({
        where: {
            userId,
        }
    });

    if (!wallet) {
        throw new BadRequest(`wallet not found`, req.body);
    }

    const data = {
        id: wallet.dataValues.uid,
        userId: wallet.dataValues.userId,
        balance: wallet.dataValues.balance,
        createdAt: wallet.dataValues.createdAt,
        updatedAt: wallet.dataValues.updatedAt
    }

    return sendJSONResponse(res, 200, {
        message: 'Wallet fetched successfully',
        status: true,
        data
    });
}

