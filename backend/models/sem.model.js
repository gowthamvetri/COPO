const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    coNo : {type : String},
    courseCode : {type : String},
    courseName : {type : String},
    staffName : {type : String},
    status : {type : String},
    category : {type : String},
    L : {type : String},
    T : {type : String},
    P : {type : String},
    C : {type : String}
});

const semesterSchema = new Schema({
    userId : {type : String},
    batchId : {type : String},
    semName: {type: String},
    subjects : [subjectSchema]
});

module.exports = mongoose.model("Semester",semesterSchema);