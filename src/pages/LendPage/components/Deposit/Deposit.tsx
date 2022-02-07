import React, { useState } from "react";
import Button from "../../../../components/Button/Button";
import TokenInputBox from "../../../../components/TokenInputBox/TokenInputBox";
import { InfoText } from "../../../../components/InfoText";
import { Amount, JetReserve, JetUser } from "../../../../jet";

import "./deposit.scss";
import { PublicKey } from "@solana/web3.js";

interface DepositProps {
  supplyApy: number;
  honeyReward: number;
  netApy: number;
  onDeposit: Function;
}

const Deposit = (props: DepositProps) => {
  const [inputAmount, setInputAmount] = useState(0);
  const [selectedTokenName, setSelectedTokenName] = useState("Solana");
  
  const handleDeposit = () => {
    if (inputAmount > 0) {
      let multiplier = selectedTokenName === 'Solana' ? 1000000000
      : selectedTokenName === 'USDC' ? 1000000 : 1;

      props.onDeposit((inputAmount * multiplier), selectedTokenName);
      setInputAmount(0)
    }
  }

  return (
    <div className="deposit-container">
      <TokenInputBox
        inputValue={inputAmount}
        setInputValue={setInputAmount}
        selectedAsset={selectedTokenName}
        setSelectedAsset={setSelectedTokenName}
      />
      <InfoText leftText="Supply APY" rightText={`${props.supplyApy}%`} />
      <InfoText leftText="HONEY rewards" rightText={`${props.honeyReward}%`} />
      <InfoText leftText="Net APY" rightText={`${props.netApy}%`} />
      <Button onClick={handleDeposit}  className="primary-button-gradient" title="Deposit" />
    </div>
  );
};

export default Deposit;
