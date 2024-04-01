module.exports = class CustomErr extends Error{
    constructor(message){
        super()
        this.message = message;
    }
}