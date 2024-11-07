import React from 'react';
import '../../styles/Background.css';

const Background = ({ children }) => {
  return (
    <div className="overlay">
      {children}
    </div>
  );
};

export default Background;
