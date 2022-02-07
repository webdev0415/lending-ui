import React, { useState, useEffect, useContext } from "react";
import ModalContainer from "../../components/ModalContainer/ModalContainer";
import TitleText from "../../components/TitleText/TitleText";
import FarmCollectionCard from "./components/FarmCollectionCard/FarmCollectionCard";
import FarmNFTsContainer from "./components/FarmNFTsContainer/FarmNFTsContainer";
import "./FarmPage.scss";
import { AllNFTsContext } from "../../App";
import Button from "../../components/Button/Button";
import farmCollections from './farms.json';

export const getCollectionExpireDate = (eventStartDate, eventDuration) => {
  const dateArray = eventStartDate.split("/").map((a, i) => {
    switch (i) {
      case 1:
        return Number(a) - 1
      case 2:
        return Number(a) + Number(eventDuration);
      default:
        return Number(a);
    }
  });
  return new Date(Date.UTC(...dateArray));
}

const FarmPage = (props) => {
  const { isLoading, walletApp, setIsLoading, WalletType } = props;
  const [showCompletedFarms, setShowCompletedFarms] = useState(false)
  const [NFTsInSelectedCollection, setNFTsInSelectedCollection] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState({});
  const { AllNFT } = useContext(AllNFTsContext);
  const [displayedCollections, setDisplayedCollections] = useState(farmCollections);
  const stakedNFT = AllNFT.filter(NFT => NFT.isStake);

  useEffect(() => {
    if (!showCompletedFarms) {
      const filteredCompletedFarmCollection = farmCollections.filter((collection, i) => (
        getCollectionExpireDate(collection.eventStartDate, collection.eventDuration) > new Date()
      ))
      setDisplayedCollections(filteredCompletedFarmCollection)
    } else {
      const filteredCompletedFarmCollection = farmCollections.filter((collection, i) => (
        getCollectionExpireDate(collection.eventStartDate, collection.eventDuration) < new Date()
      ))
      setDisplayedCollections(filteredCompletedFarmCollection)
    }
  }, [showCompletedFarms])
  
  useEffect(() => {
    setNFTsInSelectedCollection(AllNFT.filter( NFT => (
      NFT.updateAuthority && NFT.updateAuthority === selectedCollection.updateAuthority
    ))
  )}, [AllNFT, selectedCollection.updateAuthority]);
  
  return (
    <div className="farm-page">
      <div className="head">
        <TitleText>Stake NFT and earn $pHONEY</TitleText>
        <div className="filter-toggle-button">
          <Button
            className={showCompletedFarms ? "inactive" : ""}
            title="Live"
            onClick={ () => setShowCompletedFarms(false)}
          />
          <Button
            className={showCompletedFarms ? "" : "inactive"}
            title="Completed"
            onClick={ () => setShowCompletedFarms(true)}
          />
        </div>
      </div>
      <div className="main-content">
        <div className="collections-container">
          {displayedCollections.map((collection, i) => (
            <FarmCollectionCard
              key={collection.id}
              onSelect={() => setSelectedCollection(collection)}
              collection={collection}
              stakedNFT={stakedNFT}
              isSelected={selectedCollection && selectedCollection.id === collection.id}
              walletApp={walletApp}
            />
          ))}
        </div>
        <FarmNFTsContainer
          className="big-screen-nfts-container"
          collectionQuarryKey={selectedCollection.quarry_key}
          collectionrewarderKey={selectedCollection.rewarderKey}
          collectionrewardsMint={selectedCollection.rewardsMint}
          collectionrewarderTokenAccount={selectedCollection.rewarderTokenAccount}
          collectionmintWrapperPDA={selectedCollection.mintWrapperPDA}
          collectionminterPDA={selectedCollection.minterPDA}
          collectionRewardName={selectedCollection.rewardTokenName}
          userNFTsInSelectedFarm={NFTsInSelectedCollection}
          walletApp={walletApp}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          WalletType={WalletType}
        />
        <ModalContainer
          isVisible={selectedCollection.name}
          onClose={() => setSelectedCollection({})}
          className="small-screen-modal"
        >
          <FarmNFTsContainer
            className="small-screen-farm-nfts-container"
            collectionQuarryKey={selectedCollection.quarry_key}
            collectionrewarderKey={selectedCollection.rewarderKey}
            collectionrewardsMint={selectedCollection.rewardsMint}
            collectionrewarderTokenAccount={selectedCollection.rewarderTokenAccount}
            collectionmintWrapperPDA={selectedCollection.mintWrapperPDA}
            collectionminterPDA={selectedCollection.minterPDA}
            collectionRewardName={selectedCollection.rewardTokenName}
            userNFTsInSelectedFarm={NFTsInSelectedCollection}
            walletApp={walletApp}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            WalletType={WalletType}
          />
        </ModalContainer>
      </div>
    </div>
  );
};

export default FarmPage;
