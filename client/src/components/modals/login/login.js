import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Redirect } from "react-router-dom";

//components
import Form from "./login-form";
import Spinner from "../../layout/Spinner";


const IS_USERLOGGEDIN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`

const LoginPostModal = ({ hide }) => {

  const { data, loading } = useQuery(IS_USERLOGGEDIN, {
    onCompleted({ isLoggedIn }) {
      if (isLoggedIn) {
        <Redirect to='/posts' />
      }
    },
    pollInterval: 1000,
  });

  if (loading) return <Spinner />;
  
  return data.isLoggedIn && !loading ? 
  (
    <Redirect to='/posts' />
  ) : (
    <div className='modal'>
      <div className='modal-content'>
        <Form hide={hide} />
      </div>
    </div>
  );

};

export default LoginPostModal;
