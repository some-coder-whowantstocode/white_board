const {
    auth
} = require('../Controller/Socket.js')

const express = require('express');
const router = express.Router();

router.post('/auth',auth);

module.exports = router;