const { Series, Study, Modality, File } = require("../models");

const seriesResolvers = {
    Query: {
        getSeries: async (_, { id }) => {
            return await Series.findByPk(id, { include: [Study, Modality, File] });
        },
        getAllSeries: async () => {
            return await Series.findAll({ include: [Study, Modality, File] });
        }
    },
    Mutation: {
        createSeries: async (_, { idStudy, idModality, seriesName }) => {
            return await Series.create({ idStudy, idModality, seriesName });
        }
    },
    Series: {
        study: async (parent) => {
            return await Study.findByPk(parent.idStudy);
        },
        modality: async (parent) => {
            return await Modality.findByPk(parent.idModality);
        },
        files: async (parent) => {
            return await File.findAll({ where: { idSeries: parent.idSeries } });
        }
    }
};

module.exports = seriesResolvers;
