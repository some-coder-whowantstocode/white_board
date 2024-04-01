module.exports.Ratelimiter = (clients,bucketduration,bucketlimit)=>{
    return function(req,res,next){
            const IP = req.ip || req.headers['x-forwarded-for'];
            const now = Date.now();
            const clientqueue = clients.get(IP) || [];
            if(bucketduration < (now - clientqueue[0])/1000){
                clientqueue.shift();
                }
            if(clientqueue.length > bucketlimit ){
                    return res.status(429).json({ message: 'Too many requests. please request after sometime' });
            }
                clientqueue.push(now);
                clients.set(IP,clientqueue);
            next();
    }
}