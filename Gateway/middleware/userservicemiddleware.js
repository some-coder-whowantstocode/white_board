const http = require('http');

const userServiceProxy = (req,res)=>{
    try{
        const options = {
            hostname: process.env.HOST_NAME,
            port: 9310,
            path: req.originalUrl,
            method:req.method,
            headers:{
                'Content-Type': 'application/json'
            }
        };
        const proxyReq = http.request(options);
        
        proxyReq.on('response', (response) => {
            let data = '';
        
            response.on('data', (chunk) => {
            data += chunk;
            });
        
            response.on('end', () => {
                res.end(data)
            });
        });
        proxyReq.write(JSON.stringify(req.body))

        proxyReq.end()
    
    }catch(err){
        console.log(err)
    }
}


module.exports.userServiceCheck =(req,res,next)=>{
    console.log('hi')
    switch(req.url){
        case "/user/register":{
            next(userRegisterchecker);
        }
        break;
        default:{
            console.log('hi')
        }
    }
}

module.exports = {
    userServiceProxy
}