const {
    LoginUser,
    Register,
    DeleteUser,
    ChangePassword,
    ForgotPassword
} = require('./controller')

const express = require('express');
const router = express.Router();

router.post('/login', LoginUser);
router.post('/register', Register);
router.post('/remove', DeleteUser);
//used post instead of delete as delete always does not return body 
router.put('/changepass', ChangePassword);
router.post('/forgotpass', ForgotPassword);

module.exports = router;
