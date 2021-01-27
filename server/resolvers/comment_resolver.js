const { combineResolvers } = require("graphql-resolvers");

const User = require("../database/models/userSchema");
const Post = require("../database/models/postSchema");
const { isAuthenticated, isCommentOwner } = require("./middleware");

module.exports = {
  Mutation: {
    createComment: combineResolvers(
      isAuthenticated,
      async (_, { postId, input }, { loggedInUserId }) => {
        try {
          const post = await Post.findById(postId);

          if (!post) throw new Error("Post does not exists");
          
          const user = await User.findById(loggedInUserId);

          const comment = {
            username: user.username,
            text: input,
            user: loggedInUserId,
          };

          post.comments.unshift(comment);
          await post.save();

          return post.comments;

        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),

    deleteComment: combineResolvers(
      isAuthenticated,
      isCommentOwner,
      async (_, { post_id, comment_id }, { loggedInUserId }) => {
        try {
          const post = await Post.findById(post_id);
          const removeIndex = post.comments
            .map((comment) => comment.user.toString())
            .indexOf(loggedInUserId);

          post.comments.splice(removeIndex, 1);
          await post.save();

          return post.comments;

        } catch (error) {

          console.log(error);
          throw error;
          
        }
      }
    ),
  },
};
