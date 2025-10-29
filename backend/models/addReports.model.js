const mongoose = require("mongoose");

const copoReports = new mongoose.Schema({
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
    },
    flag: {
        type: String,
        required: true,
    },
    report: {
        CO1: { type: String, default: "" },
        CO2: { type: String, default: "" },
        CO3: { type: String, default: "" },
        CO4: { type: String, default: "" },
        CO5: { type: String, default: "" },
        CO6: { type: String, default: "" },
    },
});

const COPOReports = mongoose.model("COPOReports", copoReports);

module.exports = COPOReports;
