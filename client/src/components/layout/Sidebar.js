import React from "react";

const Sidebar = ({ setIsShowing }) => {

  return (
    <div id='sidebar'>
      <button
        className='button_sidebar create_post'
        onClick={() => setIsShowing(true)}
      >
        Create Post
      </button>
      <h3>tags</h3>
      <ul></ul>
    </div>
  );
};

export default Sidebar;