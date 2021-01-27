const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    profile(id: ID!): Profile!
  }

  type Profile {
    id: ID!
    collectionsSize: Int!
    postSize: Int!
    collections: [ID!]
    posts: [ID!]
  }
`;
