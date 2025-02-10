const { Modality, Series } = require("../../models");

const modalityResolvers = {
    Query: {
        getModality: async (_, { id }) => {
            return await Modality.findByPk(id, { include: Series });
        },
        getAllModalities: async () => {
            return await Modality.findAll({ include: Series });
        }
    },
    Mutation: {
        createModality: async (_, { name }) => {
            const [modality, created] = await Modality.findOrCreate({
                where: { name },
                defaults: { name }
            });
            return modality;
        }
    },
    Modality: {
        series: async (parent) => {
            return await Series.findAll({ where: { idModality: parent.idModality } });
        }
    }
};

module.exports = modalityResolvers;
