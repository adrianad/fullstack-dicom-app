const patientResolvers = require("./patient.resolver");
const studyResolvers = require("./study.resolver");
const modalityResolvers = require("./modality.resolver");
const seriesResolvers = require("./series.resolver");
const fileResolvers = require("./file.resolver");
const createFullRecordResolvers = require("./createFullRecord.resolver");       

module.exports = {
    Query: {
        ...patientResolvers.Query,
        ...studyResolvers.Query,
        ...modalityResolvers.Query,
        ...seriesResolvers.Query,
        ...fileResolvers.Query
    },
    Mutation: {
        ...patientResolvers.Mutation,
        ...studyResolvers.Mutation,
        ...modalityResolvers.Mutation,
        ...seriesResolvers.Mutation,
        ...fileResolvers.Mutation,
        ...createFullRecordResolvers.Mutation
    },
    Patient: patientResolvers.Patient,
    Study: studyResolvers.Study,
    Modality: modalityResolvers.Modality,
    Series: seriesResolvers.Series,
    File: fileResolvers.File
};
