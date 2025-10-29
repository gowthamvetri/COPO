const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentsList = new Schema({
  registrationNumber: {
    type: String,
  },
  studentsName: {
    type: String,
  },
});

const studentSchema = new Schema({
  userId: {
    type: String,
    required: false,
  },
  batchId: {
    type: String,
  },
  studentsData: [studentsList],
});

module.exports = mongoose.model("students", studentSchema);
