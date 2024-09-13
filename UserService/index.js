const express = require('express');
require('express-async-errors');
require('dotenv').config();
const app = express();
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userrouter = require('./routes.js');
const connectDB = require('./DB.js');
const errorhandler = require('./ErrorHandler/errorhandler.js');

var corsOptions = {
    origin: process.env.Allowed_ORIGIN,
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.head("/",(req,res)=>{
    res.status(200).end();
});
app.use('/user', userrouter);
app.use(errorhandler)




const port = process.env.PORT || 3000;

(async()=>{
    await connectDB();
})()
app.listen(port,()=>console.log(`app is running at port No ${port}...`))


