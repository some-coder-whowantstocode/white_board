const jwt = require('jsonwebtoken');

const {
    Unauthorized
} = require('../ErrorHandler/index.js')

const auth =async(req,res)=>{
    
    if(!req.body[process.env.CLIENT_SECRET_NAME]){
        throw new Unauthorized('unauthorized access.')
    }

    jwt.sign(req.body,process.env.JWT_SECRET)
    res.send('authenticated');
}

module.exports ={
    auth
}