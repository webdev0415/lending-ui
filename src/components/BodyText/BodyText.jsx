import React from 'react';
import './BodyText.scss';

const BodyText = props =>{
  const {light, className} = props;
  
  return(
    <p className = {`
        ${light ? "body-text-light" : "body-text"}
        ${className ? className : ""}
      `}
    >
      {props.children}
    </p>
  )
}

export default BodyText;