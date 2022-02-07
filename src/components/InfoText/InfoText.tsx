import React from "react";
import { IconLoader } from "../IconLoader";

import "./info-text.scss";

interface InfoTextProps {
  leftText: string;
  rightText: string;
  icon?: string;
  rightGreen?: boolean;
}

const InfoText = (props: InfoTextProps) => {
  return (
    <div className="info-text-container">
      <div className="info-text-left-container">
        {props.icon ? <IconLoader icon={props.icon} /> : ""}
        <span className="info-text-left">{props.leftText}</span>
      </div>
      <span
        className={`info-text-right ${
          props.rightGreen ? "info-text-green" : ""
        }`}
      >
        {props.rightText}
      </span>
    </div>
  );
};

export default InfoText;
