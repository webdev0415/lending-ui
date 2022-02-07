import React from 'react';
import './NFTImage.scss';
import ImageWithLoadBg from '../ImageWithLoadBg/ImageWithLoadBg';
import TitleText from '../TitleText/TitleText';
import SolanaIcon from '../../images/solanaIcon.png';
import SelectedIcon from '../../icons/SelectedMarkIcon';

const NFTImage = props => {
  const {
    evaluationInSOL,
    showIsSelectedMark,
    hideShadow,
    imageSrc,
    alt,
    onClick,
  } = props;



  return (
    <div
      onClick={onClick}
      className={`nft-image ${showIsSelectedMark ? "selected" : ""} ${!hideShadow ? "box-shadow" : ""}`}
    >
      {
        evaluationInSOL &&
        <div className="overlay-box">
          <div className="evaluation-tag">
            <TitleText>{evaluationInSOL}</TitleText>
            <img src={SolanaIcon} alt="solana icon" />
          </div>
        </div>
      }
      {
        showIsSelectedMark &&
        <div className='selected-mark-container overlay-box'>
          <SelectedIcon />
        </div>
      }
      <ImageWithLoadBg
        src={imageSrc}
        alt={alt}
        aspectRatio={1}
      />
    </div>
  )
}

export default NFTImage;