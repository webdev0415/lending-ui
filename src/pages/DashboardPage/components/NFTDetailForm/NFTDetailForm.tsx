import React from "react";
import Button from "../../../../components/Button/Button";
import { InfoText } from "../../../../components/InfoText";
import TokenInputBox from "../../../../components/TokenInputBox/TokenInputBox";
import { formatAmount } from "../../../../helpers";

import "./nft-detail-form.scss";

interface NFTDetailFormProps {
  title: string;
  image: string;
  borrowApy: number;
  estimatedValue: number;
  liquidationThreshold: number;
  assetsBorrowed: number;
  sol: number;
  usdc: number;
  solFiat: number;
  netBorrowBalance: number;
}

const NFTDetailForm = (props: NFTDetailFormProps) => {
  return (
    <div className="nft-detail-form">
      <div className="nft-detail-form-title">{props.title}</div>
      <div className="nft-detail-body">
        <img alt="nft" src={props.image} />
        <hr className="nft-detail-form-vertical-divider" />
        <div className="nft-detail-form-details">
          <InfoText leftText="Borrow APY" rightText={`${props.borrowApy}%`} />
          <InfoText
            leftText="Estimated value"
            rightText={`$${formatAmount(props.estimatedValue, 3, " ")}`}
          />
          <InfoText
            leftText="Liquidation threshold"
            rightGreen
            rightText={`${props.liquidationThreshold}%`}
          />
          <hr className="nft-detail-form-horizontal-divider" />
          <InfoText
            leftText="Assets borrowed"
            rightText={`$${formatAmount(props.assetsBorrowed, 3, " ")}`}
          />
          <InfoText
            icon="solana"
            leftText={`${props.sol} SOL`}
            rightText={`$${props.solFiat}`}
          />
          <InfoText
            icon="usdc"
            leftText={`${props.usdc} USDC`}
            rightText={`$${props.usdc}`}
          />
          <hr className="nft-detail-form-horizontal-divider" />
          <InfoText
            leftText="Net borrow balance"
            rightText={`$${formatAmount(props.netBorrowBalance, 3, " ")}`}
          />
        </div>
      </div>
      <div className="nft-detail-footer">
        <Button title={"Pay"} />
        <TokenInputBox />
        <Button title={"Borrow"} />
      </div>
    </div>
  );
};

export default NFTDetailForm;
