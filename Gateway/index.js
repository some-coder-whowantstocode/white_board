const express = require("express"); 
require('express-async-errors')
const morgan = require("morgan"); 
require("dotenv").config(); 
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { Filter } = require("./middleware/filter");
const Ratelimiter = require("./middleware/ratelimiter");
const { ErrorHandler } = require("./middleware/Errorhandler");
const { userServiceProxy } = require("./proxy/userserviceproxy");


const app = express(); 

const HOST = process.env.HOST_NAME; 
const port = process.env.PORT || 3000; 


var corsOptions = {
    origin: process.env.Allowed_ORIGIN,
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    allowedHeaders: 'Content-Type,Authorization', 
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}

const clients = new Map();
const bucketduration = 5;
const bucketlimit = 4;
/* clientIp =[requests] */

app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(Filter);
app.use(Ratelimiter(clients,bucketduration,bucketlimit));

app.use(morgan("dev")); 

app.use( '/user',userServiceProxy); 

app.use(ErrorHandler)


app.listen(port, HOST, () => { 
	console.log(`Starting Proxy at ${HOST}:${port}`); 
});
