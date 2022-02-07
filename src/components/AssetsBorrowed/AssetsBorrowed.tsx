import React from "react";
import { BodyWrapper } from "../BodyWrapper";
import { AssetsInfoText } from "./components";
import { AmountBigText } from "../AmountBigText";

import "./assets-borrowed.scss";

type TBorrowedAmount = {
  currency: string;
  amount: number;
};

interface AssetsBorrowedProps {
  borrowedAssets: TBorrowedAmount[];
  borrowAPY: number;
  liquidationThreshold: number;
}

const AssetsBorrowed = (props: AssetsBorrowedProps) => {
  return (
    <BodyWrapper className="assets-borrowed-container">
      {props.borrowedAssets.map((item) => (
        <AmountBigText
          className="assets-borrowed-asset"
          key={`${item.currency}-${item.amount}`}
          amount={item.amount}
          text={`${item.currency} borrowed`}
        />
      ))}
      <div className="assets-borrowed-info">
        <AssetsInfoText text="Borrow APY" percentage={props.borrowAPY} />
        <AssetsInfoText
          green={true}
          text="Liquidation threshold"
          percentage={props.liquidationThreshold}
        />
      </div>
    </BodyWrapper>
  );
};

export default AssetsBorrowed;
