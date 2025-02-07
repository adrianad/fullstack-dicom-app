// fullRecordResolvers.js

const { sequelize, File, Series, Study, Patient, Modality } = require('../../models'); // Adjust the path as needed

createFullRecordResolvers = {
    Mutation: {
        createFullRecord: async (_, { input }) => {
            try {
                const result = await sequelize.transaction(async (transaction) => {
                    // 1. Create or find the Modality record by name.
                    const [createdModality, modalityCreated] = await Modality.findOrCreate({
                        where: { name: input.modality.name },
                        defaults: { name: input.modality.name },
                        transaction
                    });

                    // 2. Create or find the Patient record by name and birthdate.
                    const [createdPatient, patientCreated] = await Patient.findOrCreate({
                        where: {
                            name: input.series.study.patient.name
                        },
                        defaults: {
                            name: input.series.study.patient.name,
                            birthdate: input.series.study.patient.birthdate
                        },
                        transaction
                    });

                    // 3. Create or find the Study record by idStudy.
                    const [createdStudy, studyCreated] = await Study.findOrCreate({
                        where: { idStudy: input.series.study.idStudy },
                        defaults: {
                            idStudy: input.series.study.idStudy,
                            idPatient: createdPatient.idPatient,
                            name: input.series.study.name,
                            date: input.series.study.date
                        },
                        transaction
                    });

                    // 4. Create or find the Series record by idSeries.
                    const [createdSeries, seriesCreated] = await Series.findOrCreate({
                        where: { idSeries: input.series.idSeries },
                        defaults: {
                            idSeries: input.series.idSeries,
                            idStudy: createdStudy.idStudy,
                            idModality: createdModality.idModality,
                            name: input.series.name,
                            date: input.series.date
                        },
                        transaction
                    });

                    // 5. Create or find the File record by a combination of idSeries and filePath.
                    const [createdFile, fileCreated] = await File.findOrCreate({
                        where: {
                            idSeries: createdSeries.idSeries,
                            filePath: input.file.filePath
                        },
                        defaults: {
                            idSeries: createdSeries.idSeries,
                            filePath: input.file.filePath
                        },
                        transaction
                    });

                    // Return the created or found File record.
                    return createdFile;
                });
                return result;
            } catch (error) {
                console.error('Error in createFullRecord mutation:', error);
                throw new Error('Failed to create full record');
            }
        }

    }
};


module.exports = createFullRecordResolvers;