require('dotenv').config();
const express = require('express');
require('express-async-errors');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');

const userrouter = require('./routes.js');
const connectDB = require('./DB.js');
const errorhandler = require('./ErrorHandler/errorhandler.js');

app.use(bodyParser.json());
app.use('/user', userrouter);
app.use(errorhandler)


const server = http.createServer(app);


const port = process.env.PORT || 3000;

(async()=>{
    await connectDB();
    server.listen(port,()=>console.log(`app is running at port No ${port}...`))
})()


