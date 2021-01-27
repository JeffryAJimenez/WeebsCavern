const { combineResolvers } = require("graphql-resolvers");

const User = require("../database/models/userSchema");
const Post = require("../database/models/postSchema");
const { isAuthenticated, isCommentOwner } = require("./middleware");

module.exports = {
  Query: {
    didUserLike: combineResolvers(
      isAuthenticated,
      async (_, { post_id }, { loggedInUserId }) => {
        try {
          if (!loggedInUserId) return false;
        
          const post = await Post.findById(post_id);

          //check if post has been liked
          if (
            post.likes.filter((like) => like.user.toString() === loggedInUserId)
              .length > 0
          ) return true;
          

          return false;

        } catch (error) {

          console.log(error);

        }
      }
    ),
  },
  Mutation: {
    like: combineResolvers(
      isAuthenticated,
      async (_, { post_id }, { loggedInUserId }) => {
        try {
          const post = await Post.findById(post_id);

          //check if post has been liked
          if (
            post.likes.filter((like) => like.user.toString() === loggedInUserId)
              .length > 0
          ) throw new Error("User already liked this post");
          
          post.likes.unshift({ user: loggedInUserId });
          post.save();

          return post.likes;

        } catch (error) {

          console.log(error);
          throw error;

        }
      }
    ),

    unlike: combineResolvers(
      isAuthenticated,
      async (_, { post_id }, { loggedInUserId }) => {
        try {

          const post = await Post.findById(post_id);

          //check if post has been liked
          if (
            post.likes.filter((like) => like.user.toString() === loggedInUserId)
              .length == 0
          )  throw new Error("User has not liked this post");
          
          //get remove index
          const removeIndex = post.likes
            .map((like) => like.user)
            .indexOf(loggedInUserId);

          post.likes.splice(removeIndex, 1);
          await post.save();

          return post.likes;

        } catch (error) {

          console.log(error);
          throw error;
          
        }
      }
    ),
  },
};
