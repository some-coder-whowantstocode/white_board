const { createProxyMiddleware } = require('http-proxy-middleware')



const target = process.env.TARGET || 'http://default-target-url.com';

const userServiceProxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  logLevel: 'debug',
  timeout:30000,
  on:{
    error:(err,req,res)=>{
      console.log(err)
      if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
        console.error('Proxy timeout error:', err);
        res.writeHead(504, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ err: 'The request timed out. Please try again later.' }));
      } 
      // else {
        // console.error('Proxy error:', err);
        // res.writeHead(500, {
        //   'Content-Type': 'application/json',
        // });
        // res.end(JSON.stringify({ error: 'Something went wrong. Please notify the developer.' }));
      // }
    }
  }
});


module.exports = {
    userServiceProxy
}