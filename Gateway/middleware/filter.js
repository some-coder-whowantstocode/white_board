const createError = require('http-errors');

module.exports.Filter = async(req,res,next)=>{
    if(req.headers.origin !== process.env.Allowed_ORIGIN){
        let err = createError(401, 'Unauthorized!')
        next(err)
    }
    next();
}