const { combineResolvers } = require("graphql-resolvers");

const Post = require("../database/models/postSchema");
const User = require("../database/models/userSchema");
const Profile = require("../database/models/Profile");
const { isAuthenticated, isPostOwner } = require("./middleware");
const { stringToBase64, base64ToString } = require("../helper");

module.exports = {
  Query: {
    post: combineResolvers(async (_, { id }) => {
      try {

        const post = Post.findById(id);
        return post;

      } catch (error) {

        console.log(error);
        throw error;

      }
    }),

    posts: combineResolvers(
      async (_, { cursor, limit = 10 }, { loggedInUserId }) => {
        try {

          const query = { user: loggedInUserId };
          if (cursor) {
            query["_id"] = {
              $lt: base64ToString(cursor),
            };
          }

          let posts = await Post.find(query)
            .sort({ _id: -1 })
            .limit(limit + 1);
          const hasNextPage = posts.length > limit;
          posts = hasNextPage ? posts.slice(0, -1) : posts;

          return {
            postFeed: posts,
            pageInfo: {
              nextPageCursor: hasNextPage
                ? stringToBase64(posts[posts.length - 1].id)
                : null,
              hasNextPage,
            },
          };

        } catch (error) {

          console.log(error);
          throw error;

        }
      }
    ),

    postsBy: async (_, { type_value, cursor, limit = 10 }) => {
      try {
        let query = null;

        if (type_value[0] === "tittle") {
          console.log("By tittle");
          query = { tittle: type_value[1] };
        } /*if(type_value[0] === "author")*/ else {
          query = { author: type_value[1] };
        }

        if (cursor) {
          query["_id"] = {
            $lt: base64ToString(cursor),
          };
        }

        let posts = await Post.find(query)
          .sort({ author: -1 })
          .limit(limit + 1);

        const hasNextPage = posts.length > limit;
        posts = hasNextPage ? posts.slice(0, -1) : posts;

        return {
          postFeed: posts,
          pageInfo: {
            nextPageCursor: hasNextPage
              ? stringToBase64(posts[posts.length - 1].id)
              : null,
            hasNextPage,
          },
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    postsByTags: async (_, { tags, cursor, limit = 10 }) => {
      try {
        const query = { tags: { $in: tags } };
        if (cursor) {
          query["_id"] = {
            $lt: base64ToString(cursor),
          };
        }

        let posts = await Post.find(query)
          .sort({ _id: -1 })
          .limit(limit + 1);

        const hasNextPage = posts.length > limit;
        posts = hasNextPage ? posts.slice(0, -1) : posts;

        return {
          postFeed: posts,
          pageInfo: {
            nextPageCursor: hasNextPage
              ? stringToBase64(posts[posts.length - 1].id)
              : null,
            hasNextPage,
          },
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },

  Mutation: {
    deletePost: combineResolvers(
      isAuthenticated,
      isPostOwner,
      async (_, { id }, { loggedInUserId }) => {
        const post = await Post.findByIdAndRemove(id);

        //remove post from the profile
        await Profile.updateOne(
          { user: loggedInUserId },
          { $pull: { posts: post.id } }
        );

        //update postsSize
        const profile = await Profile.findOne({ user: loggedInUserId });
        profile.postSize = profile.posts.length;
        await profile.save();

        return post;

      }
    ),

    updatePost: combineResolvers(
      isAuthenticated,
      isPostOwner,
      async (_, { id, input }, {email, loggedInUserId}) => {
        try {

          const post = await Post.findByIdAndUpdate(
            id,
            { ...input },
            {
              new: true,
            }
          );
          
          return post;

        } catch (error) {

          console.log(error);
          throw error;

        }
      }
    ),
    createPost: combineResolvers(
      isAuthenticated,
      async (_, { input }, { email, loggedInUserId }) => {
        try {
          //create Post -> Give post User._ID -> give User Post._ID
          //const user = await User.findOne({ email });
          const profile = await Profile.findOne({ user: loggedInUserId });
          const post = new Post({ ...input, user: loggedInUserId });
          const result = await post.save();
          profile.posts.push(result.id);
          profile.size = profile.posts.length;
          await profile.save();

          return post;

        } catch (error) {

          console.log(error);
          throw error;

        }
      }
    ),
  },
  Post: {
    user: async (parent, _, { loaders }) => {
      try {
        // const user = await User.findById(parent.user);
        const user = await loaders.user.load(parent.user.toString());
        return user;

      } catch (error) {

        console.log(error);
        throw error;

      }
    },
  },
};
