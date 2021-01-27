const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { combineResolvers } = require("graphql-resolvers");
const validator = require("validator");

//Schemas
const User = require("../database/models/userSchema");
const Post = require("../database/models/postSchema");
const Profile = require("../database/models/Profile");
const Admin = require("../database/models/Admin");


const { isValidObjectId } = require("../database/util");
const CollectionSCH = require("../database/models/Collection");
const { isAuthenticated, isPorfileOwner } = require("./middleware");
const PubSub = require("../subscription");
const { userEvents } = require("../subscription/events");

module.exports = {
  Query: {
    user: combineResolvers(async (_, { id }, { email }) => {
      try {
        if (!isValidObjectId(id)) throw new Error("Invalid User id");

        const user = await User.findById(id);

        if (!user) throw new Error("User not found!");

        return user;

      } catch (error) {

        console.log(error);
        throw error;
        
      }
    }),

    users: async (_, __, ___ ) => {
      try {

        const users = await User.find({});
      
        return users;

      } catch (error) {

        console.log(error);
        throw error;

      }
    },

    currentUser: combineResolvers(isAuthenticated, async (_, __, { email }) => {
      try {

        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
  
        return user;

      } catch (error) {

        console.log(error);
        throw error;

      }
    }),

    usersByUserName: async (_, { username }) => {
      try {
        const users = await User.find({ username });
        return users;

      } catch (error) {

        console.log(error);
        throw error;

      }
    },
  },

  Mutation: {
    deleteUser: combineResolvers(
      isAuthenticated,
      isPorfileOwner,
      async (_, { id }, { loginUserId }) => {

        try {

          const user = await User.findByIdAndRemove(id);
          const profile = await Profile.findByIdAndDelete(user.profile);

          //delete posts and collections
          await Post.deleteMany({ _id: { $in: profile.posts } });
          await CollectionSCH.deleteMany({ _id: { $in: profile.collections } });

          return user;

        } catch (error) {

          console.log(error);
          throw error;
          
        }
      }
    ),

    editUser: combineResolvers(
      isAuthenticated,
      isPorfileOwner,
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
    signup: async (_, { input }) => {
      try {
        if (!validator.isEmail(input.email)) {
          throw new Error("Not a correct email");
        }

        const user = await User.findOne({ email: input.email });

        if (await User.findOne({ username: input.username })) {
          throw new Error("Username already in use");
        }

        if (user) {
          throw new Error("Email already exists");
        }

        if (input.password !== input.password2) {
          throw new Error("Passwords do not match");
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);
        const { password2, ...other } = input;
        const newUser = new User({
          ...other,
          password: hashedPassword,
        });
        const result = await newUser.save();

        //profile
        const profile = new Profile({
          user: result.id,
          collectionsSize: 0,
          postSize: 0,
        });
        await profile.save();

        await User.findByIdAndUpdate(result.id, { profile: profile.id });

        PubSub.publish(userEvents.USER_CREATED, {
          userCreated: result,
        });

        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    createAdmin: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });

        if (user) {
          throw new Error("Email already exists");
        }

        if (input.password !== input.password2) {
          throw new Error("Passwords do not match");
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);
        const { password2, ...other } = input;

        const newUser = new User({ ...other, password: hashedPassword });
        const result = await newUser.save();

        //Profile
        const newProfile = new Profile({ user: result.id });
        await newProfile.save();

        const permissions = [
          { name: "read", permit: true },
          { name: "update", permit: true },
          { name: "delete", permit: true },
          { name: "create", permit: true },
        ];
        const admin = new Admin({ permissions, user: newUser.id }); //new USER AUTH.. DONT WANT IT
        console.log(newUser.id);
        await admin.save();

        const updatedUser = await User.findByIdAndUpdate(
          result.id,
          { roles: { admin: admin.id }, profile: newProfile.id },
          { new: true }
        );

        PubSub.publish(userEvents.USER_CREATED, {
          userCreated: result,
        });

        return updatedUser;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          input.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        const secret = process.env.JWT_SECRET_KEY || "secretmy";
        const token = jwt.sign({ email: user.email }, secret, {
          expiresIn: "1d",
        });

        return { token };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },

  Subscription: {
    userCreated: {
      subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED),
    },
  },

  User: {
    posts: async ({ id }) => {
      try {
        const posts = await Post.find({ user: id });
        return posts;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
