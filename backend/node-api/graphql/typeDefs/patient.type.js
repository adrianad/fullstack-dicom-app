const patientType = `
  type Patient {
    idPatient: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    studies: [Study] # Relationship with Study
  }

  type Query {
    getPatient(id: ID!): Patient
    getAllPatients: [Patient]
  }

  type Mutation {
    createPatient(name: String!): Patient
  }
`;

module.exports = patientType;
