const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    posts(cursor: String, limit: Int): PostFeed!
    post(id: ID!): Post
    postsBy(type_value: [String], cursor: String, limit: Int): PostFeed!
    postsByTags(tags: [String], cursor: String, limit: Int): PostFeed!
  }

  input createPostInput {
    tittle: String!
    author: String!
    url: String!
    tags: [String]
  }

  input updatePostInput {
    tittle: String
    author: String
  }

  extend type Mutation {
    createPost(input: createPostInput!): Post
    updatePost(id: ID!, input: updatePostInput!): Post
    deletePost(id: ID!): Post
  }

  type Post {
    id: ID!
    tittle: String!
    author: String!
    url: String!
    tags: [String]
    user: User!
    comments: [Comment!]
    likes: [LikeOutput]
  }

  type PostFeed {
    postFeed: [Post!]
    pageInfo: PageInfo!
  }

  type PageInfo {
    nextPageCursor: String
    hasNextPage: Boolean
  }
`;
