const CustomErr = require('./customerr')

module.exports = class Unauthorized extends CustomErr{
    constructor(message){
        super(message)
        this.statuscode = 401
    }
}