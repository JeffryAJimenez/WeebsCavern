import React from "react";
import { useState } from "react";

const Alert = ({ payload, type }) => {
  const [showAllert, toggleAllert] = useState(true);

  return showAllert ? (
    <div className={`alert alert-${type}`}>
      {payload}
      <button className='close' onClick={() => toggleAllert(false)}>
        X
      </button>
    </div>
  ) : null;
};

export default Alert;
