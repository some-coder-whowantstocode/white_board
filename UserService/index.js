require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');

const userrouter = require('./Routes/User.js');
const connectDB = require('./DB/mongodbconnection.js');
const errorhandler = require('./Middleware/errorhandler.js');

app.use(bodyParser.json());
app.use('/user',userrouter);
app.use(errorhandler)


const server = http.createServer(app);


const port = process.env.PORT || 3000;

(async()=>{
    await connectDB();
    server.listen(port,()=>console.log(`app is running at port No ${port}...`))
})()


