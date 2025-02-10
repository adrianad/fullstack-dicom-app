const patientType = require("./patient.type");
const studyType = require("./study.type");
const modalityType = require("./modality.type");
const seriesType = require("./series.type");
const fileType = require("./file.type");
const createFullRecordType = require("./createFullRecord.type");

module.exports = [patientType, studyType, modalityType, seriesType, fileType, createFullRecordType];