const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema({
    batchName : {
        type : String
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
