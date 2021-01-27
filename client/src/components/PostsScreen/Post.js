import React from "react";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";

const Post = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`}>
      <div className='post' id={post.id}>
        <h5>Image</h5>
        <Image publicId={post.url} cloudName='weebcavern-test' />
      </div>
    </Link>
  );
};

export default Post;