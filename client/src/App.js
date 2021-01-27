import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

//apollo-gql
import { ApolloProvider, ApolloClient } from "@apollo/client";

//componenets
import Layout from './components/layout'
import Posts from './components/PostsScreen/PostsScreen'

//apollo setup
import { cache } from "./cache";

const client = new ApolloClient({
  uri: "http://localhost:3001/newgraphql",
  cache,
  headers: {
    Authorization: localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : "",
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Fragment>
          <div className='container_body'>
            <Layout />
            <div className='showcase'>
              <Switch>
                <Route exact path='/' component={Posts}></Route>
                <Route exact path='/posts' component={Posts}></Route>
              </Switch>
            </div>
          </div>
        </Fragment>
      </Router>
    </ApolloProvider>
  );
}

export default App;
