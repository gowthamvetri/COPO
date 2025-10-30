const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema({
    name : {
        type : String,
        required: true
    },
    userId : {
        type : String,
        required : false
    },
    createdOn : {
        type: Date , default : new Date().getTime()
    },
})

module.exports = mongoose.model("batch",batchSchema);
