const studyType = `
  type Study {
    idStudy: String!
    idPatient: ID!
    name: String!
    date: String!
    patient: Patient # Relationship with Patient
    series: [Series] # Relationship with Series
  }

  type Query {
    getStudy(id: ID!): Study
    getAllStudies: [Study]
  }

  type Mutation {
    createStudy(idStudy: String!, idPatient: ID!, name: String!, date: String!): Study
  }
`;

module.exports = studyType;
