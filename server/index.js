require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');

const userrouter = require('./Routes/User.js');
const socketrouter = require('./Routes/Socket.js');
const connectDB = require('./DB/mongodbconnection.js');
const errorhandler = require('./Middleware/errorhandler.js');
const socketHandler = require('./socket.js');

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/user',userrouter);
app.use('/socket',socketrouter);
app.use(errorhandler)


const server = http.createServer(app);
const IO = new socketIo.Server(server);
IO.on('connection',socketHandler);


const port = process.env.PORT || 3000;

(async()=>{
    await connectDB();
    server.listen(port,()=>console.log(`app is running at port No ${port}...`))
})()


