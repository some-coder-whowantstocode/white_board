const http = require('http');
const https = require('https');

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

        let proxyReq;
        if(process.env.BUILD_LEVEL === 'production'){
          proxyReq = https.request(options);
        }else{
          proxyReq = http.request(options);
        }
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



// createProxyMiddleware({
//   target: process.env.TARGET,
//   changeOrigin: true,
//   pathRewrite: (path, req) => req.originalUrl,
//   onProxyReq: (proxyReq, req, res) => {
//     console.log(req)
//     proxyReq.setHeader('Content-Type', 'application/json');
//     proxyReq.setHeader('cookie', req.headers.cookie);
//     proxyReq.setTimeout(Number(process.env.TIMEOUT));
//     if (req.body) {
//       proxyReq.write(JSON.stringify(req.body));
//     }
//   },
//   onProxyRes: (proxyRes, req, res) => {
//     let data = '';
//     proxyRes.on('data', (chunk) => {
//       data += chunk;
//     });
//     proxyRes.on('end', () => {
//       res.status(proxyRes.statusCode || 200).send(data);
//     });
//   },
//   onError: (err, req, res) => {
//     if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
//       res.status(408).json({ msg: 'Oops! sorry request timeout.' });
//     } else {
//       err.message = 'server not reachable.';
//       next(err);
//     }
//   }
// });


module.exports = {
    userServiceProxy
}