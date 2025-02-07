const fullRecordTypeDefs = `
  # Input types for nested creation

  input CreatePatientInput {
    name: String!
    birthdate: String!
  }

  input CreateStudyInput {
    idStudy: String!     # Provide an id or generate one in the resolver
    name: String!
    date: String!
    patient: CreatePatientInput!
  }

  input CreateSeriesInput {
    idSeries: String!    # Provide an id or generate one in the resolver
    idModality: ID!      # This can be provided or created via modality input
    name: String!
    date: String!
    study: CreateStudyInput!
  }

  input CreateFileInput {
    filePath: String!
  }

  input CreateModalityInput {
    name: String!
  }

  # This is the composite input for creating the full record
  input CreateFullRecordInput {
    modality: CreateModalityInput!
    series: CreateSeriesInput!
    file: CreateFileInput!
  }

  # Extend the Mutation type to add the full record creation
  extend type Mutation {
    createFullRecord(input: CreateFullRecordInput!): File
  }
`;

module.exports = fullRecordTypeDefs;
