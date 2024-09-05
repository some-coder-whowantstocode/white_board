

const errorhandler = (err,req,res,next)=>{
    if(err.statuscode){
        res.status(err.statuscode ).json({err:err.message||"something went wrong in the server"})
    }else{
        console.log(err)
        res.status(500 ).json({err:"something went wrong in the server"})
    }
        
}

module.exports = errorhandler