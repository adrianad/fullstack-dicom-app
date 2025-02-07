const { Patient, Study } = require("../../models");

const patientResolvers = {
    Query: {
        getPatient: async (_, { id }) => {
            return await Patient.findByPk(id, { include: Study });
        },
        getAllPatients: async () => {
            return await Patient.findAll({ include: Study });
        }
    },
    Mutation: {
        createPatient: async (_, { name, birthdate }) => {
            const [patient, created] = await Patient.findOrCreate({
                where: { name },
                defaults: { name, birthdate }
            });
            return patient;
        }
    },
    Patient: {
        studies: async (parent) => {
            return await Study.findAll({ where: { idPatient: parent.idPatient } });
        }
    }
};

module.exports = patientResolvers;
