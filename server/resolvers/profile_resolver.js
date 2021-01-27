const { combineResolvers } = require("graphql-resolvers");

const Profile = require("../database/models/Profile");
const { isValidObjectId } = require("../database/util");

module.exports = {
  Query: {
    profile: combineResolvers(async (_, { id }) => {
      try {
        const profile = await Profile.findById(id);

        if (!profile) {
          throw new Error("Profile not found");
        }

        return profile;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  },
};
