const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const canvasSchema = new Schema({
    createdBy:{
        type:String,
        required:[true, "Creater of this canvas is missing"]
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
    shapes:{
        type:Array,
    }
});

module.exports = Canvas = mongoose.model('canvas', canvasSchema);
