import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";



const CREATE_POST = gql`
    mutation($tittle: String!, $author: String!, $url: String!, $tags: [String]) {
        createPost(
            input: { tittle: $tittle, author: $author, url: $url, tags: $tags }
        ) {
            url
            author
            tittle
            tags
        }
    }
`

const Form = ({ hide }) => {
    const [formData, setFormData] = useState({ username: "", name: "", email: "", password: "", password2: "", });
    const { username, name, email, password, password2 } = formData;

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted() {
      hideModal();
    },
  });

  const hideModal = () => hide();
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });



  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await createPost({
        variables: {  
            username: username,
            name: name,
            email: email,
            password: password,
            password2: password2, },
      });

    } catch (err) {

      console.log("Errors---", err);

    }
  };

  return (
    <form
      className='create_post_form'
      onSubmit={(e) => {
        onSubmit(e);
      }}
    >
         <h1>Sign Up Weeb</h1>
            <label htmlFor='input_usernamel'>Username</label> <br></br>
            <input
              type='text'
              id='input_username'
              name='username'
              placeholder='Username'
              onChange={(e) => onChange(e)}
            ></input>{" "}
            <br></br>
            <label htmlFor='input_name'>Name</label> <br></br>
            <input
              type='text'
              id='input_name'
              name='name'
              placeholder='Name'
              onChange={(e) => onChange(e)}
            ></input>{" "}
            <br></br>
            <label htmlFor='input_email'>Email</label> <br></br>
            <input
              type='text'
              id='input_email'
              name='email'
              placeholder='Email'
              onChange={(e) => onChange(e)}
            ></input>{" "}
            <br></br>
            <label htmlFor='input_password'>Password</label>
            <br></br>
            <input
              type='password'
              id='input_password'
              name='password'
              placeholder='Password'
              onChange={(e) => onChange(e)}
            ></input>
            <br></br>
            <label htmlFor='input_confirm_password'>Confirm Password</label>
            <br></br>
            <input
              type='password'
              id='input_confirm_password'
              name='password2'
              placeholder='Confirm Password'
              onChange={(e) => onChange(e)}
            ></input>
            <br></br>
            <button type='submit' className='button button-upload'>SIGN UP</button>
            <button className='button button-upload-cancel'
              onClick={() => hideModal()} >
                Cancel!
            </button>
            <p>
              Already a member?
            </p>
    </form>
  );
};

export default Form;