require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');

const  router = require('./Routes/User.js');
const connectDB = require('./DB/mongodbconnection.js');
const errorhandler = require('./Middleware/errorhandler.js');
const socketHandler = require('./socket.js');


app.use(bodyParser.json());

const server = http.createServer(app);

const IO = new socketIo.Server(server);

IO.on('connection',socketHandler);

app.use('/user',router)

app.use(errorhandler)

const port = process.env.PORT || 3000;

(async()=>{
    await connectDB();
    server.listen(port,()=>console.log(`app is running at port No ${port}...`))
})()


