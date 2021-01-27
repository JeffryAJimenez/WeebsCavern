const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    getCollections(cursor: String, limit: Int): CollectionFeed
    getACollection(id: ID!): Collection!
  }

  extend type Mutation {
    newCollection(tittle: String!, post_ID: [ID!]): Collection!
    addToCollection(col_ID: ID!, post_ID: [ID!]!): Collection!
    deleteFromCollection(col_ID: ID!, post_ID: [ID!]!): Collection!
    deleteCollection(col_ID: ID!): Collection!
  }

  type CollectionFeed {
    collectionFeed: [Collection!]
    pageInfo: PageInfo!
  }

  type Collection {
    id: ID!
    user: ID!
    banner: [String!]
    size: Int!
    tittle: String!
    posts: [ID!]
  }
`;
