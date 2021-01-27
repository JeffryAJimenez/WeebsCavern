const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

//resolvers && typeDefs
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

//database util method
const {connection} = require('./database/util')

//helper for context
const {verifyUser} = require('./helper/context')

//set env variables
dotEnv.config();

const app = express();

//Connect Database
connection()
//cors
app.use(cors());

//body parser middleware
app.use(express.json());

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
      const contextObj = {};
      if (req) {
        await verifyUser(req);
        (contextObj.email = req.email),
        (contextObj.loggedInUserId = req.loggedInUserId);
      }
    
      // contextObj.loaders = {
      //   user: new Dataloader((keys) => loaders.user.batchUsers(keys)),
      // };
    
      return contextObj;
    },
    formatError: (error) => {
      return {
        message: error.message,
      };
    },
});

apolloServer.applyMiddleware({app, path: '/newgraphql'});

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {res.send({message: "Hello"})});

app.listen(PORT, () => {
    console.log(`Server listerning on PORT: ${PORT}`); 
    console.log(`GraphQL Endpoint: ${apolloServer.graphqlPath}`);
});

