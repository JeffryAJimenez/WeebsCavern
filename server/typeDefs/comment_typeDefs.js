const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Mutation {
    createComment(postId: ID!, input: String): [Comment]!
    deleteComment(post_id: ID!, comment_id: ID!): [Comment]
  }

  type Comment {
    id: ID
    user: String
    username: String
    text: String
    date: Int
  }
`;
