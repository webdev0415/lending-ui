import React, { useState } from 'react';
import Button from '../../../../components/Button/Button';
import DetailSet from '../../../../components/DetailSet/DetailSet';
import NFTImage from '../../../../components/NFTImage/NFTImage';
import TitleText from '../../../../components/TitleText/TitleText';
import TokenInputBox from '../../../../components/TokenInputBox/TokenInputBox';
import BodyText from '../../../../components/BodyText/BodyText';
import './BorrowForm.scss';

const BorrowForm = props => {
  const { selectedNFT, className } = props;
  const [inputValue, setInputValue] = useState("");
  const [selectedAssest, setSelectedAsset] = useState("Solana")


  return (
    <div className={`selected-nft-details ${className}`}>
      {
        !selectedNFT ?
          <div className="empty-state-msgs">
            <TitleText>Selected collateral details go here</TitleText>
            <BodyText>⚠️ THESE VALUES ARE PLACEHOLDERS</BodyText>
          </div>
          :
          <>
            <div className="img-container">
              <NFTImage
                imageSrc={selectedNFT.image}
              />
            </div>
            <TitleText>{selectedNFT.name}</TitleText>

            <div className="details-container">
              <DetailSet
                name="Estimated value"
                value="$32,500"
              />
              <DetailSet
                name="Borrow limit"
                value="$20,500"
              />
              <DetailSet
                name="Borrow APY"
                value="15.5%"
              />
            </div>

            <div className="form">
              <TokenInputBox
                inputValue = {inputValue}
                setInputValue = {setInputValue}
                selectedAsset = {selectedAssest}
                setSelectedAsset = {setSelectedAsset}
                maxValue = "90"
              />
              <div className="borrow-btn">
                <Button title="Borrow" />
              </div>
            </div>
          </>
      }
    </div>
  )
}

export default BorrowForm;