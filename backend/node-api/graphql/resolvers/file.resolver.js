const { File, Series } = require("../../models");

const fileResolvers = {
    Query: {
        getFile: async (_, { id }) => {
            return await File.findByPk(id, { include: Series });
        },
        getAllFiles: async () => {
            return await File.findAll({ include: Series });
        }
    },
    Mutation: {
        createFile: async (_, { idSeries, filePath }) => {
            return await File.create({ idSeries, filePath });
        }
    },
    File: {
        series: async (parent) => {
            return await Series.findByPk(parent.idSeries);
        }
    }
};

module.exports = fileResolvers;
