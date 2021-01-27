const { combineResolvers } = require("graphql-resolvers");

const User = require("../database/models/userSchema");
const Post = require("../database/models/postSchema");
const Admin = require("../database/models/Admin");
const Profile = require("../database/models/Profile");
const { isAuthenticated, isAdmin } = require("./middleware");

module.exports = {
  Query: {},

  Mutation: {
    deletePost_Admin: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (_, { id }, { loggedInUserId }) => {
        try {
          const admin = await Admin.findOne({ user: loggedInUserId });
          const permit = admin.hasPermissionTo("delete");

          if (!permit) {
            throw new Error("This user cannot delete posts");
          }

          const post = await Post.findById(id);
          if (!post) {
            throw new Error("Post was not found");
          }

          const profile = await Profile.findOne({ user: post.user });

          if (!profile) {
            throw new Error("Profile was not found");
          }

          //remove Post
          await Profile.updateOne(
            { user: post.user },
            { $pull: { posts: post.id } }
          );
          await post.remove();

          return post;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),

    deleteUser_Admin: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (_, { id }, { loggedInUserId }) => {
        try {
          //test this !!!!!!!!!

          const admin = await Admin.findOne({ user: loggedInUserId });
          const permit = admin.hasPermissionTo("delete");

          console.log("======", permit);
          if (!permit) {
            throw new Error("This admin account cannot delete users");
          }

          const user = await User.findByIdAndRemove(id);
          const profile = await Profile.findByIdAndDelete(user.profile);
          console.log(profile.posts);

          //delete all posts
          await Post.deleteMany({ _id: { $in: profile.posts } });

          if (!user) {
            throw new Error("user was not found");
          }
          return user;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),

    editUser_Admin: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (_, { id, input }, { loginUserId }) => {
        try {
          const user = await User.findByIdAndUpdate(
            id,
            { ...input },
            { new: true }
          );
          return user;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
  },
};
