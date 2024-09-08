const {
    LoginUser,
    Register,
    DeleteUser,
    ChangePassword,
    ForgotPassword,
    UpdateUser,
    verifyUser
} = require('./controller')

const express = require('express');
const router = express.Router();

router.post('/login', LoginUser);
router.post('/register', Register);
router.post('/remove', DeleteUser);
router.post('/update',UpdateUser)
//used post instead of delete as delete always does not return body 
router.post('/changepass/:token', ChangePassword);
router.post('/forgotpass', ForgotPassword);
router.post('/verify', verifyUser);

module.exports = router;
