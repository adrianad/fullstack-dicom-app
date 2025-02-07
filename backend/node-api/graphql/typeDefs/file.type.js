const fileType = `
  type File {
    idFile: ID!
    idSeries: String!
    filePath: String!
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
