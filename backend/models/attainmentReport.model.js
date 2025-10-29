const mongoose = require("mongoose");

const attainmentReportSchema = new mongoose.Schema({
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
    isSem: {
        type: Boolean,
        default : false,
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

const AttainmentReport = mongoose.model("AttainmentReport", attainmentReportSchema);

module.exports = AttainmentReport;
