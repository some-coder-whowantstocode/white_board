const  CustomErr = require("./customerr");

module.exports =  class NotFound extends CustomErr{
    constructor(message){
        super();
        this.message = message;
        this.statuscode = 404;
    }
}