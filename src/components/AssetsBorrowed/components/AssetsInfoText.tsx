import React from 'react';
import BodyText from '../../BodyText/BodyText';

import './assets-info-text.scss';

interface AssetsInfoTextProps {
  text: string;
  percentage: number;
  green?: boolean;
  className?: string
}

const AssetsInfoText = (props: AssetsInfoTextProps) => {
  return (
    <div className={`assets-info-text-container ${props.className || ''}`}>
      <div className='assets-info-text-title'>
        <BodyText>{props.text}</BodyText>
      </div>
      <div className={`assets-info-text-percentage ${props.green ? 'assets-info-text-green' : ''}`}>
        <BodyText light={true}>{props.percentage}%</BodyText>
      </div>
    </div>
  )
}

export default AssetsInfoText;