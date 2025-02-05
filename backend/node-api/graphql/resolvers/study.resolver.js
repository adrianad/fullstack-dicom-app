const { Study, Patient, Series } = require("../models");

const studyResolvers = {
    Query: {
        getStudy: async (_, { id }) => {
            return await Study.findByPk(id, { include: [Patient, Series] });
        },
        getAllStudies: async () => {
            return await Study.findAll({ include: [Patient, Series] });
        }
    },
    Mutation: {
        createStudy: async (_, { idPatient, studyName }) => {
            return await Study.create({ idPatient, studyName });
        }
    },
    Study: {
        patient: async (parent) => {
            return await Patient.findByPk(parent.idPatient);
        },
        series: async (parent) => {
            return await Series.findAll({ where: { idStudy: parent.idStudy } });
        }
    }
};

module.exports = studyResolvers;
