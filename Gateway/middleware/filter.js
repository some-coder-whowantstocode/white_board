module.exports.Filter = (req,res,next)=>{
    if(req.headers.origin !== process.env.Allowed_ORIGIN){
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    next();
}