import React from "react";
import { formatAmount } from "../../helpers";
import BodyText from "../BodyText/BodyText";

import "./amount-big-text.scss";

interface AmountBigTextProps {
  text: string;
  amount: number;
  className?: string;
  hideDollarSign?: boolean;
}

const AmountBigText = (props: AmountBigTextProps) => {
  return (
    <div className={props.className || ""}>
      <BodyText>{props.text}</BodyText>
      <h3 className="fiat-amount-big-text-amount ">
        {`${props.hideDollarSign ? "" : "$"} ${formatAmount(
          props.amount,
          3,
          " "
        )}`}
      </h3>
    </div>
  );
};

export default AmountBigText;
