const http = require('http');

const userServiceProxy = async(req,res,next)=>{
        const options = {
            hostname: process.env.HOST_NAME,
            port: 9310,
            path: req.originalUrl,
            method:req.method,
            headers:{
                'Content-Type': 'application/json',
                'cookie':`${req.headers.cookie}`,
            },
            timeout:Number(process.env.TIMEOUT)
        };

        console.log(options.headers)
        
        const proxyReq = http.request(options);
        proxyReq.on('response', (response) => {
            try {
            let data = '';
            res.status(response.statusCode || 200)
            res.writeHead(response.statusCode, response.headers);
            
            response.on('data', (chunk) => {
            data += chunk;
            });
        
            response.on('end', () => {
                res.end(data)
            });


            response.on('error',(err)=>{
                err.message = "error at userproxy";
                next(err)
            }) 
            } catch (error) {
                console.log(error);
            }
        });


        proxyReq.on('timeout',()=>{
            res.status(408).json({msg:'Oops! sorry request timeout.'})
        })

        proxyReq.on("error",(err)=>{
            err.message = 'server not reachable.'
            next(err);
            
        })
        proxyReq.write(JSON.stringify(req.body))

        proxyReq.end()
 
}

module.exports = {
    userServiceProxy
}