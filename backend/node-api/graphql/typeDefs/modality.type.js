const { gql } = require("apollo-server");

const modalityType = gql`
  type Modality {
    idModality: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    series: [Series] # Relationship with Series
  }

  type Query {
    getModality(id: ID!): Modality
    getAllModalities: [Modality]
  }

  type Mutation {
    createModality(name: String!): Modality
  }
`;

module.exports = modalityType;
