const { combineResolvers } = require("graphql-resolvers");

const Post = require("../database/models/postSchema");
const User = require("../database/models/userSchema");
const Profile = require("../database/models/Profile");
const CollectionSCH = require("../database/models/Collection");
const { isAuthenticated, isCollectionOwner } = require("./middleware");
const { stringToBase64, base64ToString } = require("../helper");

module.exports = {
  Query: {
    getACollection: async (_, { id }) => {
      const col = await CollectionSCH.findById(id);
      return col;
    },

    getCollections: async (_, { cursor, limit = 10 }, { loggedInUserId }) => {
      try {
        const query = {};
        if (cursor) {
          query["_id"] = {
            $lt: base64ToString(cursor),
          };
        }

        let collections = await CollectionSCH.find(query)
          .sort({ _id: -1 })
          .limit(limit + 1);

        const hasNextPage = collections.length > limit;
        collections = hasNextPage ? collections.slice(0, -1) : collections;

        return {
          collectionFeed: collections,
          pageInfo: {
            nextPageCursor: hasNextPage
              ? stringToBase64(collections[collections.length - 1].id)
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
    deleteCollection: combineResolvers(
      isAuthenticated,
      isCollectionOwner,
      async (_, { col_ID }, { loggedInUserId }) => {
        const col = await CollectionSCH.findByIdAndDelete(col_ID);
        await Profile.updateOne(
          { user: loggedInUserId },
          { $pull: { collections: col_ID } }
        );

        //Update Collection Size
        const profile = await Profile.findOne({ user: loggedInUserId });
        profile.collectionsSize = profile.collections.length;
        await profile.save();

        return col;
      }
    ),

    deleteFromCollection: combineResolvers(
      isAuthenticated,
      isCollectionOwner,
      async (_, { col_ID, post_ID }, { loggedInUserId }) => {
        await CollectionSCH.updateOne(
          { _id: col_ID },
          {
            $pull: { posts: { $in: post_ID } },
          }
        );

        //update collection Size
        const col = await CollectionSCH.findById(col_ID);
        col.size = col.posts.length;
        await col.save();

        return col;
      }
    ),

    addToCollection: combineResolvers(
      isAuthenticated,
      isCollectionOwner,
      async (_, { col_ID, post_ID }, { loggedInUserId }) => {
        //make sure there are no duplicates

        const mod = await CollectionSCH.updateOne(
          { _id: col_ID },
          { $addToSet: { posts: { $each: post_ID } } }
        );

        const col = await CollectionSCH.findById(col_ID);
        console.log(mod);

        if (mod["nModified"] !== 0) {
          if (col.banner.length < 4) {
            //fix this later
            const ids = post_ID.slice(0, 4 - col.banner.length);
            const posts = await Post.find({ _id: { $in: ids } });

            posts.map((post) => col.banner.push(post.url));
          }
          col.size = col.posts.length;
          await col.save();
        }

        return col;
      }
    ),

    newCollection: combineResolvers(
      isAuthenticated,
      async (_, { tittle, post_ID }, { loggedInUserId }) => {
        try {
          const profile = await Profile.findOne({ user: loggedInUserId });
          const ids = post_ID.slice(0, 4);
          const posts = await Post.find({ _id: { $in: ids } });

          const urls = posts.map((post) => post.url);

          var newCo_OBJ = {
            tittle,
            user: loggedInUserId,
            size: 0,
            banner: post_ID ? urls : [],
            posts: [],
          };
          post_ID
            ? (newCo_OBJ = {
                ...newCo_OBJ,
                posts: post_ID,
                size: post_ID.length,
              })
            : newCo_OBJ;

          const newCo = new CollectionSCH({ ...newCo_OBJ });
          await newCo.save();

          profile.collections.push(newCo.id);
          profile.collectionsSize = profile.collections.length;
          await profile.save();

          return newCo;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
  },
};
