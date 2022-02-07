import React from "react";
import { BodyWrapper } from "../BodyWrapper";

import "./choice-renderer.scss";

type TComponent = {
  title: string;
  component: React.ReactNode;
};

interface ChoiceRendererProps {
  components: TComponent[];
  selected: number;
  changeHandler: (index: number) => void;
}

const ChoiceRenderer = (props: ChoiceRendererProps) => {
  return (
    <BodyWrapper className="choice-renderer">
      <div className="choice-renderer-header">
        {props.components.map((item: TComponent, index: number) => {
          return (
            <div
              key={item.title}
              onClick={() => props.changeHandler(index)}
              className={`choice-renderer-option ${
                index === props.selected ? "choice-renderer-selected" : ""
              } `}
            >
              {item.title}
            </div>
          );
        })}
      </div>
      <div className="choice-renderer-body">
        {props.components[props.selected].component}
      </div>
    </BodyWrapper>
  );
};

export default ChoiceRenderer;
