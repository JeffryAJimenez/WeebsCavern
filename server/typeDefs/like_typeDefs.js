const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    didUserLike(post_id: ID!): Boolean!
  }
  extend type Mutation {
    like(post_id: ID!): [LikeOutput]!
    unlike(post_id: ID!): [LikeOutput]
  }

  type LikeOutput {
    user: ID
  }
`;
