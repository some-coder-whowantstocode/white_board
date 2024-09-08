

const errorhandler = (err,req,res,next)=>{

    switch (err.name) {
        case 'TokenExpiredError':
            err.statusCode = 401;
        break;
        case 'JsonWebTokenError':
            err.statusCode = 401;
        break;
        case 'NotBeforeError':
            err.statusCode = 401;
        break;
    }
    if(err.statuscode){
        res.status(err.statuscode ).json({err:err.message||"something went wrong in the server"})
    }else{
        console.log(err)
        res.status(500 ).json({err:"something went wrong in the server"})
    }
        
}

module.exports = errorhandler