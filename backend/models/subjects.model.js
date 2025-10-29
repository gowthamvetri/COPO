const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const mappingSchema = new Schema({
    cono : {type:String},
    courseOutcome : {type : String},
    PO1 : {type : Number},
    PO2 : {type : Number},
    PO3 : {type : Number},
    PO4 : {type : Number},
    PO5 : {type : Number},
    PO6 : {type : Number},
    PO7 : {type : Number},
    PO8 : {type : Number},
    PO9 : {type : Number},
    PO10 : {type: Number},
    PO11 : {type : Number},
    PO12 : {type : Number},
    PS01 : {type:Number},
    PS02: {type:Number},
    PS03: {type:Number}
})

const copoMapping = new Schema({
    userId : {type : String},
    batchId : {type : String},
    subjectName : {type:String},
    subjectCode : {type : String},
    subjectMapData : [mappingSchema]    
})

module.exports = mongoose.model("subjectsMapping",copoMapping);

