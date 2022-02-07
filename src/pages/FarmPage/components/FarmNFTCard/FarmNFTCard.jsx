import React, { useContext, useMemo, useState } from "react";
import Button from "../../../../components/Button/Button";
import "./FarmNFTCard.scss";
import { stake, unstake } from "../../../../helpers/utils";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { programs } from "@metaplex/js";
import { AllNFTsContext } from "../../../../App";
import ImageWithLoadBg from "../../../../components/ImageWithLoadBg/ImageWithLoadBg";
import BodyText from "../../../../components/BodyText/BodyText";
import { programIds } from "../../../../helpers/ids";
import { ConnectionContext } from "../../../../contexts/connection";

export const stakeNFTfarm = async (
  tokenId,
  walletApp,
  setIsLoading,
  quarry_key,
  WalletType,
  tokacc,
  rewarderKey,
  connection
) => {
  const { metadata: { Metadata }, } = programs;
  const METADATA_PROGRAM_ID = new PublicKey(programIds().farm.METADATA_PROGRAM_ID);
  setIsLoading({value: true, msg: 'Staking...'})
  try {
    const data = await Metadata.load(connection, tokenId);
    console.log(data.data.mint); // NFT mint key 38miBsvVgxEorsxHkNqQktmLDxCz49F7nki5mSCAknuz
    console.log(data.data.updateAuthority); // uA : AmivaqHeZBgUZkzEZ44Mi9zQJruExZMP4PVRYduFVkaS
    let NFTupdateAuthority = new PublicKey(data.data.updateAuthority);

    console.log(data);

    let NFTkey = new PublicKey(data.data.mint);
    const [metadataPub, metadata_bump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        NFTkey.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );
    console.log(metadataPub.toBase58());
    await stake(
      NFTkey,
      metadataPub,
      NFTupdateAuthority,
      metadata_bump,
      walletApp,
      quarry_key,
      WalletType,
      tokacc,
      rewarderKey,
      connection
    );
    setIsLoading({value: true, msg: 'Confirming...', isStaked: false});
    setTimeout(()=>{
      setIsLoading({value: true, msg: 'Staked', isStaked: false});
    }, 10000)
    setTimeout(()=>{
      setIsLoading({value: false, msg: '', isStaked: true});
    }, 15000)
  } catch (error) {
    setIsLoading({value: true, msg: "Stake Failed", isStaked: false});
    setTimeout(()=>{
      setIsLoading({value: false, msg: "", isStaked: false})
    }, 2000);
    throw error;
  }

};

export const unstakeNFTfarm = async (
  tokenId,
  walletApp,
  setIsLoading,
  quarry_key,
  WalletType,
  rewarderKey,
  connection
) => {
  const { metadata: { Metadata }, } = programs;
  const METADATA_PROGRAM_ID = new PublicKey(programIds().farm.METADATA_PROGRAM_ID);
  setIsLoading({value: true, msg: 'Unstaking...', isStaked: true})
  try {
    const data = await Metadata.load(connection, tokenId);
    let NFTkey = new PublicKey(data.data.mint);
    const [metadataPub, metadata_bump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        NFTkey.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );
    console.log(metadataPub.toBase58());
    await unstake(NFTkey, metadataPub, metadata_bump, walletApp, quarry_key, WalletType, rewarderKey, connection);
    setIsLoading({value: true, msg: 'Confirming...', isStaked: false});
    setTimeout(()=>{
      setIsLoading({value: true, msg: 'Unstaked', isStaked: false});
    }, 10000)
    setTimeout(()=>{
      setIsLoading({value: false, msg: '', isStaked: false});
    }, 15000)
  } catch (error) {
    
    setIsLoading({value: true, msg: "Unstake Failed", isStaked: true});
    setTimeout(()=>{
      setIsLoading({value: false, msg: "", isStaked: true})
    }, 2000);
    throw error;
  }
};

const FarmNFTCard = (props) => {
  const { NFT, walletApp, quarry_key, rewarderKey, WalletType } = props;
  const { connection } = useContext(ConnectionContext);

  const { toggleNFTStakeStatus } = useContext(AllNFTsContext);

  const initialIsStaked = useMemo(() => {console.log('called'); return(NFT.isStake)}, []);

  const [isLoading, setIsLoading] = useState({
    value: false,
    msg: '',
    isStaked: initialIsStaked
  });

  const stake = async () =>{
    try {
      await stakeNFTfarm(NFT.tokenId, walletApp, setIsLoading, quarry_key, WalletType, NFT.tokacc, rewarderKey, connection);
      toggleNFTStakeStatus(NFT.tokenId);      
    } catch (error) {
      console.log(error);
    }

  }

  const unstake = async () => {
    try {
      await unstakeNFTfarm(NFT.tokenId, walletApp, setIsLoading, quarry_key, WalletType, rewarderKey, connection);
      toggleNFTStakeStatus(NFT.tokenId)      
    } catch (error) {
      console.log(error)
    }
    
  }

  return (
    <div className="farm-nft-card">
      <ImageWithLoadBg
        src={NFT.image}
        alt=""
        aspectRatio={1}
        bgColor="#262730"
      />
      {
        isLoading.value
        ? <BodyText className="is-loading-msg">{isLoading.msg}</BodyText>
        : <Button
            title={ isLoading.isStaked ? "Unstake" : "Stake"}
            onClick={isLoading.isStaked ? unstake : stake}
          />
      }
    </div>
  );
};

export default FarmNFTCard;