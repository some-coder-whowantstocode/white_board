const CustomErr = require('./customerr')

module.exports = class BadRequest extends CustomErr{
    constructor(message){
        super(message)
        this.statuscode = 400
    }
}