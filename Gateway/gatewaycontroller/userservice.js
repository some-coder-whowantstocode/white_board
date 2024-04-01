const { createProxyMiddleware } = require("http-proxy-middleware"); 


const userRegisterProxy = createProxyMiddleware({ 
		target: process.env.USER_SERVICE_URL, 
		changeOrigin: true,
        pathRewrite:{
            '^/user/register':''
        }
	}) 


module.exports = {
    userRegisterProxy
}