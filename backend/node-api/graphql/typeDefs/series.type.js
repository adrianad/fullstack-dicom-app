const seriesType = `
  type Series {
    idSeries: ID!
    idStudy: ID!
    idModality: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    study: Study # Relationship with Study
    modality: Modality # Relationship with Modality
    files: [File] # Relationship with File
  }

  type Query {
    getSeries(id: ID!): Series
    getAllSeries: [Series]
  }

  type Mutation {
    createSeries(idStudy: ID!, idModality: ID!, seriesName: String!): Series
  }
`;

module.exports = seriesType;
