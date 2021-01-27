const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Mutation {
    editUser_Admin(id: ID!, input: editUserInput_Admin): User
    deletePost_Admin(id: ID!): Post
    deleteUser_Admin(id: ID!): User
  }

  input editUserInput_Admin {
    name: String
    username: String
    email: String
  }
`;
