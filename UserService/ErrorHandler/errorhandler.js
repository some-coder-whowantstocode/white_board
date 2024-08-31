

const errorhandler = (err,req,res,next)=>{
    res.status(err.statuscode || 500).json({err:err.message||"something went wrong in the server"})
        
}

module.exports = errorhandler