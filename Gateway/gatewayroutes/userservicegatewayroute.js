const { userRegisterProxy } = require('../gatewaycontroller/userservice');

const Router = require('express').Router();

Router.post('/register',userRegisterProxy)


module.exports = Router