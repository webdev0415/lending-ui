import React from "react";
import "./body-wrapper.scss";

interface BodyWrapperProps {
  children: React.ReactNode;
  className?: string;
  borderRadiusSmall?: boolean;
  style?: Record<string, string>;
}

const BodyWrapper = (props: BodyWrapperProps) => {
  return (
    <div
      className={`body-wrapper ${
        props.borderRadiusSmall ? "body-wrapper-small" : ""
      } ${props.className || ""}`}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

export default BodyWrapper;
