import React, { useCallback, useEffect, useState } from "react";
import BodyText from "../../components/BodyText/BodyText";
import TitleText from "../../components/TitleText/TitleText";
import "./dashboard-page.scss";
import DashboardAreaChart from "./components/DashboardAreaChart/DashboardAreaChart";
import { getNFTstaked } from "../../helpers/utils";
import { useConnection } from "../../contexts/connection";
import farms from '../FarmPage/farms.json';
import { getCollectionExpireDate } from "../FarmPage/FarmPage";


const openFarms = farms.filter((collection, i) => (
  getCollectionExpireDate(collection.eventStartDate, collection.eventDuration) > new Date()
))

const DashboardPage = (props: any) => {
  const { walletApp } = props;
  const [ totalNFTsDeposited, setTotalNFTsDeposited ] = useState('...');
  const [farmCollections, setFarmCollections] = useState(openFarms);
  const connection = useConnection();
  const [farmsEarningPerStake, setFarmEarningPerStake] = useState([]);

  const fetchFarmData = useCallback( async () => {
    
    let fetchNumberOfNFTsAndEarningPerStake = async (quaryyKey: string, allocation: string, index: number) => {
      const numOfStakedNFTs = await getNFTstaked(quaryyKey, walletApp, connection);
      const earningPerStake = (Number(numOfStakedNFTs) !== 0 && allocation)
        ? Number(allocation) / Number(numOfStakedNFTs) : 0;
      return ({ numOfStakedNFTs: Number(numOfStakedNFTs), earningPerStake, index});
    }

    const promises = openFarms.map( async (farm, index) => {
      return await fetchNumberOfNFTsAndEarningPerStake(
        farm.quarry_key, farm.allocation, index
      );
    });

    const newFarmCollections :any = [];
    const newFarmsEarningPerStake: any = [];

    for await (let val of promises) {
      newFarmCollections.push({
        name: openFarms[val.index].name,
        imageUrl: openFarms[val.index].imageUrl,
        numOfStakedNFTs: val.numOfStakedNFTs,
      })
      newFarmsEarningPerStake.push(val.earningPerStake.toFixed(1));
    }

    setFarmCollections(newFarmCollections);
    setFarmEarningPerStake(newFarmsEarningPerStake);
    
    const newTotalNFTsDeposited = newFarmCollections.reduce((acc: number, item: any) => (
      Number(item.numOfStakedNFTs) + acc
    ), 0);
    setTotalNFTsDeposited(newTotalNFTsDeposited);
  }, [walletApp, connection]);

  useEffect(()=>{
    fetchFarmData()
  }, [fetchFarmData])

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-stats-container">
        <div className="dashboard-stat">
          <TitleText>TVL</TitleText>
          <TitleText>$ 3,001,781</TitleText>
        </div>
        <div className="dashboard-stat">
          <TitleText>NFTs Deposited</TitleText>
          <TitleText>{totalNFTsDeposited}</TitleText>
        </div>
        <div className="dashboard-stat">
          <TitleText>Total Deposit</TitleText>
          <TitleText>...</TitleText>
        </div>
        <div className="dashboard-stat">
          <TitleText>Total Borrow</TitleText>
          <TitleText>...</TitleText>
        </div>
      </div>
      <div className="most-traded-and-charts-container">
        <div className="most-traded-container">
          <TitleText>Collections Rewards (Daily)</TitleText>
          <div className="cards-container">
            {
              farmCollections.map( (nft, i) => (
                <div className="most-traded-nft-card">
                  <BodyText>{i + 1}</BodyText>
                  <img src={nft.imageUrl} alt={nft.name}/>
                  <div className="title-and-volume-container">
                    <BodyText>{nft.name}</BodyText>
                    <BodyText light>{farmsEarningPerStake[i] || ""} $pHONEY/stake</BodyText>
                  </div>
                  {/* <BodyText light className="percent-change">{nft.change}</BodyText> */}
                </div>                
              ))
            }
          </div>
        </div>
        <div className="charts-container">
            <TitleText>Emission of $pHONEY</TitleText>
            <div className="chart">
              <DashboardAreaChart />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
