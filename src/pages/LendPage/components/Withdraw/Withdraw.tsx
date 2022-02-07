import React, { useState } from "react";
import Button from "../../../../components/Button/Button";
import TokenInputBox from "../../../../components/TokenInputBox/TokenInputBox";
import { InfoText } from "../../../../components/InfoText";
import { Amount, JetReserve, JetUser } from "../../../../jet";
import { User } from "../../../../helpers/jet/JetTypes";

import "./withdraw.scss";
import { PublicKey } from "@solana/web3.js";

interface WithdrawProps {
  supplyApy: number;
  honeyReward: number;
  netApy: number;
  onWithdraw: Function;
}

const Withdraw = (props: WithdrawProps) => {
  const [inputAmount, setInputAmount] = useState(0);
  const [selectedTokenName, setSelectedTokenName] = useState("Solana");

  
  // const withdrawToken = async (tokenAmount: number, tokenName: string) => {
  //   try {
  //     if (!props.jetUser || !props.jetReserve) 
  //       return; 
  //     const amount = Amount.tokens(tokenAmount);
  //     const associatedTokenAccount: PublicKey | undefined = await props.deriveAssociatedTokenAccount(tokenName);
  //     if (associatedTokenAccount) {
  //       const withdrawSlip = await props.jetUser.withdraw(props.jetReserve, associatedTokenAccount, amount, props.user);
  //       console.log(withdrawSlip);
  //     }      
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const withdrawHandler = () => {
    if (inputAmount > 0) {
      let multiplier = selectedTokenName === 'Solana' ? 1000000000
      : selectedTokenName === 'USDC' ? 1000000 : 1;
      props.onWithdraw((inputAmount * multiplier), selectedTokenName);
      setInputAmount(0)
    }
  }

  return (
    <div className="withdraw-container">
      <TokenInputBox
        inputValue={inputAmount}
        setInputValue={setInputAmount}
        selectedAsset={selectedTokenName}
        setSelectedAsset={setSelectedTokenName}
      />
      <InfoText leftText="Supply APY" rightText={`${props.supplyApy}%`} />
      <InfoText leftText="HONEY rewards" rightText={`${props.honeyReward}%`} />
      <InfoText leftText="Net APY" rightText={`${props.netApy}%`} />
      <Button onClick={withdrawHandler} className="primary-button-gradient" title="Withdraw" />
    </div>
  );
};

export default Withdraw;
