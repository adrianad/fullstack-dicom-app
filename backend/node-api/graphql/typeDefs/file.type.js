const { gql } = require("apollo-server");

const fileType = gql`
  type File {
    idFile: ID!
    idSeries: ID!
    filePath: String!
    createdAt: String!
    updatedAt: String!
    series: Series # Relationship with Series
  }

  type Query {
    getFile(id: ID!): File
    getAllFiles: [File]
  }

  type Mutation {
    createFile(idSeries: ID!, filePath: String!): File
  }
`;

module.exports = fileType;
