const express = require('express');
require('express-async-errors');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');

const userrouter = require('./routes.js');
const connectDB = require('./DB.js');
const errorhandler = require('./ErrorHandler/errorhandler.js');

app.use(bodyParser.json());
// app.use(cookieParser())

app.use('/user', userrouter);
app.use(errorhandler)




const port = process.env.PORT || 3000;

(async()=>{
    await connectDB();
    app.listen(port,()=>console.log(`app is running at port No ${port}...`))
})()


