const express = require("express");
require('express-async-errors');
const morgan = require("morgan");
require("dotenv").config();
const cors = require('cors');

const { Filter } = require("./middleware/filter");
const Ratelimiter = require("./middleware/ratelimiter");
const { ErrorHandler } = require("./middleware/Errorhandler");
const { userServiceProxy } = require("./proxy/userserviceproxy");

const app = express();

const port = process.env.PORT || 3000;

var corsOptions = {
    origin: process.env.Allowed_ORIGIN,
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

const clients = new Map();
const bucketduration = 5;
const bucketlimit = 4;
/* clientIp =[requests] */

app.use(cors(corsOptions));
app.use(Filter);
app.use(Ratelimiter(clients, bucketduration, bucketlimit));

app.use(morgan("dev"));
app.use('/user', userServiceProxy); 

app.use(ErrorHandler);

app.listen(port, () => {
    console.log(`Starting Proxy at localhost:${port}`);
});
