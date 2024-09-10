require('dotenv').config();
const express = require('express');
require('express-async-errors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');

const router = require('./routes.js');
const connectDB = require('./DB.js');
const errorhandler = require('./ErrorHandler/errorhandler.js');

app.use(bodyParser.json());
app.use(cookieParser())
app.use('/canvas', router);
app.use(errorhandler)


const server = http.createServer(app);


const port = process.env.PORT || 3000;

(async()=>{
    await connectDB();
    server.listen(port,()=>console.log(`app is running at port No ${port}...`))
})()


