const {
    CustomErr,
    BadRequest
} = require('../ErrorHandler/index');

const errorhandler = (err,req,res,next)=>{
        if(err instanceof CustomErr || err instanceof BadRequest){
            return res
            .status(err.statuscode)
            .json({msg:err.message})
        }
       
        else{
            return res
            .status(500)
            .json(
                {msg:err.message||"something went wrong in the server"}
                )
        }
        
}

module.exports = errorhandler