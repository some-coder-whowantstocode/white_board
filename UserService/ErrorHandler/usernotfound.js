const CustomErr = require('./customerr')

module.exports = class UserNotFound extends CustomErr{
    constructor(message){
        super(message)
        this.statuscode = 550
    }
}