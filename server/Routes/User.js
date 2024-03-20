const {
    LoginUser,
    Register,
    DeleteUser,
    ChangePassword,
    ForgotPassword
} = require('../Controller/User.js')

const express = require('express');
const router = express.Router();

router.post('/login', LoginUser);
router.post('/register', Register);
router.delete('/remove/:id', DeleteUser);
router.put('/change/:id', ChangePassword);
router.post('/forgot', ForgotPassword);

module.exports = router;
