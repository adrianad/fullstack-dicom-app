const seriesType = `
  type Series {
    idSeries: String!
    idStudy: String!
    idModality: ID!
    name: String!
    date: String!
    study: Study # Relationship with Study
    modality: Modality # Relationship with Modality
    files: [File] # Relationship with File
  }

  type Query {
    getSeries(id: ID!): Series
    getAllSeries: [Series]
  }

  type Mutation {
    createSeries(idSeries: String!, idStudy: String!, idModality: ID!, name: String!, date: String!): Series
  }
`;

module.exports = seriesType;
