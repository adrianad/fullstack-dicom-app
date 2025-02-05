const studyType = `
  type Study {
    idStudy: ID!
    idPatient: ID!
    name: String!
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
