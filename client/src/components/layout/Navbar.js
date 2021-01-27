import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import { useQuery, useLazyQuery, gql } from "@apollo/client";
import { isLoggedInVar } from "../../cache";


const IS_USERLOGGEDIN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`

const GET_LOGGED_USER = gql`
    query {
        currentUser {
            id
            name
            email
            username
            profile
            createdAt
        }
    }
`;


const Navbar = ({setIsShowing, setIsShowing_signup, setComponent}) => {
  const [getUser, { loading, data: userInfo }] = useLazyQuery(
    GET_LOGGED_USER
  );

  const { data } = useQuery(IS_USERLOGGEDIN, {
    onCompleted({ isLoggedIn }) {
      if (isLoggedIn) getUser();
    },

    pollInterval: 1000,

  });

  return (
    <header id='main_header'>
      <div id='header_box'>
        <h1>WeebsCarvern</h1>

        <form id='search_form'>
          <input id='search_bar' type='search' placeholder='search'></input>
          <i className='fa fa-search'></i>
        </form>
      </div>

      <div className='clr'></div>

      <ul id='header_nav'>
        {data.isLoggedIn && !loading && userInfo ? (
          <Fragment>
            <li>
              <Link to={`/posts`}>Posts</Link>
            </li>
            <li>
              <a href='CollectionsScreen.html'> Collection</a>
            </li>
            <li>
              <a href='UsersScreen.html'>Users</a>
            </li>
            <li>
              Tags
            </li>

            <li>
              <Link to={`/profile/${userInfo.currentUser.id}`}>Profile</Link>
            </li>

            <li>
              <button className="logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  isLoggedInVar(false);
                  window.location.replace("/")
                }}
              >
                LogOut
              </button>
            </li>
          </Fragment>
        ) : (
          <Fragment>
            <li>
              <Link to={`/posts`}>Posts</Link>
            </li>
            <li>
              <a href='CollectionsScreen.html'> Collection</a>
            </li>
            <li>
              <a href='UsersScreen.html'>Users</a>
            </li>
            <li>
              Tags
            </li>
            <li>
            <button className="logout"
                onClick={() => {
                  setIsShowing(true)
                }}
              >
                LogIn
              </button>
            </li>
            <li>
            <button className="logout"
                onClick={() => {
                  setIsShowing_signup(true)
                }}
              >
                SignUp
              </button>
            </li>
          </Fragment>
        )}
      </ul>
    </header>
  );

};

export default Navbar;