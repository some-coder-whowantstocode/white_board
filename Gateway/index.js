const express = require("express"); 
const morgan = require("morgan"); 
require("dotenv").config(); 
const cors = require('cors');

const userService = require('./gatewayroutes/userservicegatewayroute');
const { Filter } = require("./middleware/filter");
const { Ratelimiter } = require("./middleware/ratelimiter");

const app = express(); 

const HOST = "localhost"; 
const { PORT } = process.env; 


var corsOptions = {
    origin: "http://localhost:1100",
    optionsSuccessStatus: 200 
}

const clients = new Map();
const bucketduration = 5;
const bucketlimit = 4;
/* clientIp =[requests] */

app.use(cors(corsOptions));
app.use(Filter);
app.use(Ratelimiter(clients,bucketduration,bucketlimit));

app.use(morgan("dev")); 

app.use( 
	'/user',
	userService
); 

app.listen(PORT, HOST, () => { 
	console.log(`Starting Proxy at ${HOST}:${PORT}`); 
});
