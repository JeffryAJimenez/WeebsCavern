import React from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import { Redirect } from "react-router-dom";

//components
import Form from "./create-post-form";
import Spinner from "../../layout/Spinner";


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

const CreatePostModal = ({ hide }) => {

  const [getUser, currentUser] = useLazyQuery(GET_LOGGED_USER);
  const { data, loading } = useQuery(IS_USERLOGGEDIN, {
    onCompleted({ isLoggedIn }) {
      if (isLoggedIn) {
        getUser();
      }
    },
    pollInterval: 1000,
  });

  if (loading) return <Spinner />;
  
  return data.isLoggedIn && !loading ? (
    <div className='modal'>
      <div className='modal-content'>
        <Form hide={hide} />
      </div>
    </div>
  ) : (
    <Redirect to='/Login' />
  );

};

export default CreatePostModal;
