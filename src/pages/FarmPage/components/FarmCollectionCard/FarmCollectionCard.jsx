import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import BodyText from '../../../../components/BodyText/BodyText';
import DetailSet from '../../../../components/DetailSet/DetailSet';
import TitleText from '../../../../components/TitleText/TitleText';
import './FarmCollectionCard.scss';
import { getNFTstaked } from "../../../../helpers/utils";
import WaveTriangleImage from '../../../../images/waveTriangle.png';
import { getCollectionExpireDate } from '../../FarmPage';
import { useConnection } from '../../../../contexts/connection';

const renderCountDown = ({ hours, minutes, seconds, days }) => (
  <BodyText>
    {days}days: {hours}hrs: {minutes}mins
  </BodyText>
)

const renderLaunchCountdown = ({ hours, minutes, seconds, days }) => {
  console.log()
  return(
  <div className="launch-countdown">
    <div>
      <TitleText>{days}</TitleText>
      <BodyText>Days</BodyText>
    </div>
    <div>
      <TitleText>{hours}</TitleText>
      <BodyText>Hours</BodyText>
    </div>
    <div>
      <TitleText>{minutes}</TitleText>
      <BodyText>Mins</BodyText>
    </div>
    <div>
      <TitleText>{seconds}</TitleText>
      <BodyText>Secs</BodyText>
    </div>
  </div>    
  )
}

const FarmCollectionCard = props => {
  const { collection, onSelect, stakedNFT, isSelected, walletApp} = props;
  const connection = useConnection();
  const {
    imageUrl,
    name,
    allocation,
    eventDuration,
    eventStartDate,
    quarry_key,
    rewardTokenName
  } = collection;
  console.log({collection})

  const startDate = getCollectionExpireDate(eventStartDate, 0).valueOf();
  const hasPoolStarted = new Date().valueOf() > startDate;

  const [NFTtotalStaked, setNFTTotalStaked] = useState(0);

  var stakedNFTlen=0;
  
  for(let i=0; i<stakedNFT.length; i++){
    if(stakedNFT[i].updateAuthority === collection.updateAuthority){
      stakedNFTlen+=1; 
    }
  }

  useEffect(() => {
    getNFTstaked(quarry_key, walletApp, connection).then((totalnftStaked) => {
     setNFTTotalStaked(totalnftStaked);
    });
  }, [connection, walletApp, quarry_key]);
  
  const earningPerStake = (Number(NFTtotalStaked) !== 0 && allocation) ? Number(allocation) / Number(NFTtotalStaked) : 0;

  return (
    <div onClick={!hasPoolStarted ? null : onSelect} className={`farm-collection-card ${isSelected ? "selected" : ""}`}>
      <img className='wave-triangle' src={WaveTriangleImage} alt="wave triangle" />
      <div className="head">
        <div className={`collection-name-and-image ${!hasPoolStarted ? 'column' : ''}`}>
          <img src={imageUrl} alt={name} />
          <TitleText>{name}</TitleText>
        </div>
      </div>
      {
        !hasPoolStarted ?
        <div className="pool-launch-countdown-container">
          <BodyText>Pool opens in</BodyText>
          <Countdown date={new Date(startDate)} renderer={renderLaunchCountdown} />
        </div>
        :
      <div className="staking-details">
        <DetailSet
          name="Event duration"
          valueComponent={<Countdown date={new Date(startDate + (eventDuration * 24 * 60 * 60 * 1000))} renderer={renderCountDown} />}
        />
        <DetailSet name="Collection allocation" value={allocation ? `${allocation} $${rewardTokenName}/day` : '--'} />
        <DetailSet name="Total NFTs staked" value={NFTtotalStaked} />
        <DetailSet name="Earning per stake" value={earningPerStake ? `${earningPerStake.toFixed(1)} $${rewardTokenName}/day` : '--'} />
        <DetailSet name="Your NFTs staked" value={stakedNFTlen} />
      </div>        
      }

    </div>
  )
}

export default FarmCollectionCard;