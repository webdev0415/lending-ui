import React from 'react';
import BodyText from '../BodyText/BodyText';
import './DetailSet.scss';

const DetailSet = props =>{
  const {name, value, valueComponent} = props;

  return(
    <div className = "detail-set">
      <BodyText light>{name}</BodyText>
      {
        valueComponent
         ? valueComponent
         : <BodyText>{value}</BodyText>
      }
    </div>
  )
}

export default DetailSet;