import React from "react";

import { IconLoader } from "../../IconLoader";

import "./sidebar-item.scss";
import { Link } from "react-router-dom";
import TitleText from "../../TitleText/TitleText";

interface SidebarItemProps {
  title: string;
  icon: string;
  selected: boolean;
  isExternalLink?: boolean;
  externalHref?: any;
}

const SidebarItem = (props: SidebarItemProps) => {
  if(props.isExternalLink) {
    return(
      <a
        target="_blank"
        className={`sidebar-item ${
          props.selected ? "sidebar-item-selected" : ""
        }`}
        rel="noreferrer"
        href={props.externalHref}
      >
        <div className="sidebar-item-icon-contnainer">
          <IconLoader icon={props.icon} isIconSelected={props.selected} />
        </div>
        <TitleText>{props.title}</TitleText>
      </a>
    )
  } else {
    return(
      <Link
        to={`/${props.title.toLowerCase()}`}
        className={`sidebar-item ${
          props.selected ? "sidebar-item-selected" : ""
        }`}
      >
        <div className="sidebar-item-icon-contnainer">
          <IconLoader icon={props.icon} isIconSelected={props.selected} />
        </div>
        <TitleText>{props.title}</TitleText>
      </Link>      
    )
  }
};

export default SidebarItem;
