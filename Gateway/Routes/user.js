const { userRegisterchecker, userLoginchecker } = require('../gatewaycontroller/userservice');
const { userServiceProxy } = require('../middleware/userservicemiddleware');

const Router = require('express').Router();

Router.post('/register',userRegisterchecker,userServiceProxy)
Router.post('/login',userLoginchecker,userServiceProxy)

module.exports = Router