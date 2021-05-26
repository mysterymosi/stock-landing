const { Forbidden } = require('../helpers/error');
const models = require('../database/models/index');
const { sendJSONResponse } = require('../helpers');

/*
    !create points model/table with relation to user
    !create Id table with relation to user
    !fetch userId from decoded middleware jwt
    !create a points table for users on signup
    !create a cache table to store successful 2fa 
    !and delete 2fa after action
    !{2fa: true, action: transfer/etc/}
*/
exports.IDnumber = async function (req,res) {
    //id here refers to bvn number or nin
    const {id,type} = req.body;
    const userId = req.decoded;
    
    //check if id number exists in case someone tries to sign in with anothers user id number
    const idExists = await models.points.findOne({
        where: {
            id,
        }
    })
    if(idExists){
        throw new Forbidden(`id already exists`,req.body)
    }

    if (type === 'nin'){
        //verification logic for nin goes here
        //if verification fails stop flow and throw error
    }
    if (type === 'bvn'){
        //verification logic for bvn goes here
        //if verification fails stop flow and throw error
    }
     await models.sequelize.query(`UPDATE points SET id= id + 4`,{
        model: models.points,
        mapToModel: true
    })
    
    await models.id.create({
        type,
        id,
        userId
    });
    return sendJSONResponse(res,200,{
        message: 'Id verified',
        status: true,
        data: {
            points: 4,
            type
        }
    })
}

