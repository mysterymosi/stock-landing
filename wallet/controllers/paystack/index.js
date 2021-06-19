const {sendJSONResponse} = require('../../helpers');
const {BadRequest, Forbidden} = require('../../helpers/error');
const models = require('../../database/models')
const axios = require('axios');


const reasons = ["fund","buy"];
const psSecretKey = process.env.PS_SECRET_KEY;
const psApi = 'https://api.paystack.co';
exports.transactionInit = async function (req,res) {
    const {email,uid} = req.decoded;
    const {amount,currency,reason} = req.body;
    if(!reasons.includes(reason)){
        throw new BadRequest(`${reason} is not a valid reason`, {reason})
    }
    const params = {
        method: 'post',
        url: `${psApi}/transaction/initialize/`,
        data: {
          email,
          amount: amount*100,
          metadata:{
              reason,
              uid 
          },
        channels:["card"],
        },
        headers: {
            Authorization: `Bearer ${psSecretKey}`,
            'Content-Type': 'application/json'
        }
    }
    const response = await axios(params)

    //save access code and transaction ref to transaction table with user id
    await models.transaction.create({
        userId: uid,
        ref: response.data.data.reference
    })
    return sendJSONResponse(res,200,{
        ...response.data
    })
}

exports.psWebhook = async function (req,res) {
    let {event,data} = req.body
    let userId = data.metadata.uid;
    /*
        on sucessful event
        check the metadata for the reason the transaction was made
        if its a fund reason, update the wallet associated with the userId
        if its a buy reason, add the stocks to the users stocks
        update the transaction to successful
    */ 
   switch (event) {
       case 'charge.success':
           let updatedAt = createDate();
           await models.transaction.update({
               status: "successful",
               updatedAt
           },{
               where: {
                   ref: data.reference
               }
           });
           await models.sequelize.query(`UPDATE wallets SET balance = balance + '${data.amount}' WHERE ("userId" = '${userId}')`, {
            model: models.wallet,
            mapToModel: true // pass true here if you have any mapped fields
        })
           break;
       case 'customeridentification.success':

            break;
       default:
           break;
   }
   
}


function createDate() {
    let date = new Date();

    return date.toISOString().slice(0,19).replace('T',' ');
}
