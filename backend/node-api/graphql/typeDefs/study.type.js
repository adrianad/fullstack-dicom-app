const { gql } = require("apollo-server");

const studyType = gql`
  type Study {
    idStudy: ID!
    idPatient: ID!
    studyName: String!
    createdAt: String!
    updatedAt: String!
    patient: Patient # Relationship with Patient
    series: [Series] # Relationship with Series
  }

  type Query {
    getStudy(id: ID!): Study
    getAllStudies: [Study]
  }

  type Mutation {
    createStudy(idPatient: ID!, studyName: String!): Study
  }
`;

module.exports = studyType;
