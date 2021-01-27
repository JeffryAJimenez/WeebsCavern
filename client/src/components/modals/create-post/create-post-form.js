import React, { useState, useCallback } from "react";
import axios from "axios";
import { useMutation, gql } from "@apollo/client";
import { useDropzone } from "react-dropzone";


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
  const [formData, setFormData] = useState({tittle: "", author: "", tags: "", url: "", file: null, });
  const { tittle, author, tags, file } = formData;

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted() {
      hideModal();
    },
  });

  const hideModal = () => hide();
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFormData({ ...formData, file: acceptedFiles[0] });
    },
    [formData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArr = tags.split(",");

      const imgData = new FormData();
      imgData.append("file", file);
      imgData.append("upload_preset", "ml_default");
      const res = await axios.post(
        "https://api.Cloudinary.com/v1_1/weebcavern-test/image/upload",
        imgData
      );

      await createPost({
        variables: { tittle, author, tags: tagsArr, url: res.data.public_id },
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
      <label for='input_tittle'>Title </label> <br />
      <input
        type='text'
        id='input_tittle'
        name='tittle'
        placeholder='Tittle...'
        onChange={(e) => onChange(e)}
      />{" "}
      <br />
      <label for='input_auhtor'>Author </label> <br />
      <input
        type='text'
        id='input_author'
        name='author'
        placeholder='Author...'
        onChange={(e) => onChange(e)}
      />{" "}
      <br />
      <label for='input_tags'>Tags </label> <br />
      <input
        type='text'
        id='input_tags'
        name='tags'
        placeholder='(anime, weeb, etc..)'
        onChange={(e) => onChange(e)}
      />{" "}
      <br />
      <label for='img'>Select image: </label> <br />
      <div {...getRootProps()}>
        <input {...getInputProps()} />{" "}
        {isDragActive ? (
          <p style={{ color: "#000" }}>Drop the files here ...</p>
        ) : (
          <p style={{ color: "#000" }}>
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>
      <button className='button button-upload' type='submit'>
        Post!
      </button>
      <button
        className='button button-upload-cancel'
        onClick={() => hideModal()}
      >
        Cancel!
      </button>
    </form>
  );
};

export default Form;
