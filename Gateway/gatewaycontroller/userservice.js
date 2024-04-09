const createError = require('http-errors');


const userRegisterchecker = (req,res,next) =>{
    const { body: { name, email, password } = {} } = req;

    if (!name || !email || !password) {
        return next(createError.BadRequest('Please provide all credentials gateway.'));
    }

	req.body = {
		name,email,password
	}

    next();
}

const userLoginchecker = (req,res,next)=>{
    const { body: { email, password } = {} } = req;

    if (!email || !password) {
        return next(createError.BadRequest('Please provide all credentials gateway.'));
    }

	req.body = {
		email,password
	}

    next();
}


module.exports = {
    userRegisterchecker,
    userLoginchecker
}
