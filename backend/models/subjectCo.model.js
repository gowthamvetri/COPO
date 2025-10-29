const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectCo = new Schema({
  userId: {
    type: String,
    required: true,
  },
  batchId: {
    type: String,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
    unique: true,
  },
  CO1: {
    type: [Number],
    default: [],
  },
  CO2: {
    type: [Number],
    default: [],
  },
  CO3: {
    type: [Number],
    default: [],
  },
  CO4: {
    type: [Number],
    default: [],
  },
  CO5: {
    type: [Number],
    default: [],
  },
  CO6: {
    type: [Number],
    default: [],
  },
});

module.exports = mongoose.model("SubjectCO", subjectCo);
