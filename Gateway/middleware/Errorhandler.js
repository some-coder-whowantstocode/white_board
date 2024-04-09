module.exports.ErrorHandler =(error,req,res,next)=>{
    if(error){
        res.status( error.status || 500 );
        res.send({
            err:error.message
        });
    }
  
}