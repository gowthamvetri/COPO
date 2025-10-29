const mongoose = require("mongoose");

const semReport = new mongoose.Schema({
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
    report: {
        CO1: { type: Number, default: "" },
        CO2: { type: Number, default: "" },
        CO3: { type: Number, default: "" },
        CO4: { type: Number, default: "" },
        CO5: { type: Number, default: "" },
        CO6: { type: Number, default: "" },
    },
});

const semCOReport = mongoose.model("SemCOReport", semReport);

module.exports = semCOReport;
