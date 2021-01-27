import React, { Fragment, useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { Redirect } from "react-router-dom";

import { isLoggedInVar } from "../../../cache";

import Alert from '../../Alert/Error'



const LOGIN = gql`
mutation($email: String!, $password: String!) {
  login(input: { email: $email, password: $password }) {
    token
  }
}
`

const IS_USER_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

const Form = ({ hide }) => {
  const [formData, setFormData] = useState({email: "", password: "", });
  const { email, password } = formData;

  const { data } = useQuery(IS_USER_LOGGED_IN);

  const [login, {error, loading}] = useMutation(LOGIN, {
    onCompleted({ login }) {
      localStorage.setItem("token", login.token);
      isLoggedInVar(true);
    },

    refetchQueries: [{ query: IS_USER_LOGGED_IN }],
  });

  const hideModal = () => hide();
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });



  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await login({
        variables: { email: email, password: password },
      });

    } catch (err) {

      console.log("Errors---", err);

    }
  };

  return !loading && data.isLoggedIn ? (
    <Redirect to='/posts' />
  ) : (
    <Fragment>
      {!loading && error ? <Alert payload={error.message} type={"danger"} /> : null}
      <form
        className='create_post_form'
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <label for='input_email'>Email </label> <br />
        <input
          type='text'
          id='input_email'
          name='email'
          placeholder='email...'
          onChange={(e) => onChange(e)}
        />{" "}
        <br />
        <label for='input_auhtor'>Password </label> <br />
        <input
          type='password'
          id='input_password'
          name='password'
          placeholder='Password...'
          onChange={(e) => onChange(e)}
        />{" "}
        <br />
        <button className='button button-upload' type='submit'>
          Login!
        </button>
        <button
          className='button button-upload-cancel'
          onClick={() => hideModal()}
        >
          Cancel!
        </button>
      </form>
    </Fragment>
  );
};

export default Form;
