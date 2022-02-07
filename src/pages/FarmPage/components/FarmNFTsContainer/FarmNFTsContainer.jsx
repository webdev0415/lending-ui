import React, { useContext, useState } from "react";
import BodyText from "../../../../components/BodyText/BodyText";
import Button from "../../../../components/Button/Button";
import TitleText from "../../../../components/TitleText/TitleText";
import FarmNFTCard from "../FarmNFTCard/FarmNFTCard";
import "./FarmNFTsContainer.scss";
import { claimAllRewards } from "../../../../helpers/utils";
import { AllNFTsContext } from "../../../../App";
import RefreshIcon from "../../../../icons/RefreshIcon";
import LoadingCircleIcon from "../../../../icons/LoadingCircleIcon";
import { ConnectionContext } from "../../../../contexts/connection";

const FarmNFTsContainer = (props) => {
  const {
    userNFTsInSelectedFarm,
    className,
    collectionQuarryKey,
    collectionrewarderKey,
    collectionrewardsMint,
    collectionrewarderTokenAccount,
    collectionmintWrapperPDA,
    collectionminterPDA,
    walletApp,
    isLoading,
    setIsLoading,
    WalletType,
    collectionRewardName
  } = props;
  const { updateNFTs } = useContext(AllNFTsContext);
  const [isUpdatingNFTs, setIsUpdatingNFTs] = useState(false);
  const { connection } = useContext(ConnectionContext)

  if (!collectionQuarryKey) {
    return (
      <div
        className={`user-nfts-container empty-state-container ${className || ""
          }`}
      >
        <BodyText>Select a collection</BodyText>
      </div>
    );
  }

  const onRefresh = async () => {
    try {
      setIsUpdatingNFTs(true)
      await updateNFTs();
      setIsUpdatingNFTs(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={`user-nfts-container ${className || ""}`}>
      <div className="head">
        <div className="left-container">
          {
            // Boolean(userNFTsInSelectedFarm.length) &&
            (
              isUpdatingNFTs ?
              <div className="loading-circle-container">
                <LoadingCircleIcon />
              </div>
              :
              <div onClick={onRefresh} className="refresh-btn">
                <RefreshIcon />
              </div>              
            )
          }
          <TitleText>{`Your NFTs`}</TitleText>          
        </div>

        { Boolean(userNFTsInSelectedFarm.length) && (
          <div className="honey-reward-head">
            <Button
              title={`Claim all $${collectionRewardName}`}
              onClick={(e) => {
                claimAllRewards(
                  walletApp,
                  collectionQuarryKey,
                  WalletType,
                  collectionrewarderTokenAccount,
                  collectionmintWrapperPDA,
                  collectionminterPDA,
                  collectionrewardsMint,
                  collectionrewarderKey,
                  connection
                );
              }}
            />
          </div>
        )}
      </div>
      {isLoading.Farm ? (
        <div className="loading">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : userNFTsInSelectedFarm.length ? (
        <div className="farm-nft-cards-container">
          {userNFTsInSelectedFarm.map((NFT, i) => (
            <FarmNFTCard
              key={i}
              image={NFT.image}
              NFT={NFT}
              isStake={NFT.isStake}
              walletApp={walletApp}
              setIsLoading={setIsLoading}
              quarry_key={collectionQuarryKey}
              rewarderKey={collectionrewarderKey}
              WalletType={WalletType}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-container">
          <BodyText>You have no NFT in this collection</BodyText>
        </div>
      )}
    </div>
  );
};

export default FarmNFTsContainer;
