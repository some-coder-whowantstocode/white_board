

const errorhandler = (err,req,res,next)=>{

    switch (err.name) {
        case 'TokenExpiredError':
            err.statuscode = 401;
        break;
        case 'JsonWebTokenError':
            err.statuscode = 401;
            err.message = "Friendly reminder!!! Do not try to tamper with url"
        break;
        case 'NotBeforeError':
            err.statuscode = 401;
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