import React from "react";
import { BodyWrapper } from "../BodyWrapper";
import { SidebarItem } from "./components";
import { useLocation } from "react-router-dom";

import "./sidebar.scss";
import { IconLoader } from "../IconLoader";

type TSidebarItem = {
  title: string;
  icon: string;
};

type TSocial = {
  link: string;
  icon: string;
};

interface SidebarProps {
  title: string;
  items: TSidebarItem[];
  socials: TSocial[];
  className?: string;
}

const Sidebar = (props: SidebarProps) => {
  const location = useLocation();

  return (
    <BodyWrapper
      borderRadiusSmall={true}
      className={`sidebar ${props.className || ""}`}
    >
      <h1 className="sidebar-title">{props.title}</h1>
      <hr className="sidebar-divider" />
      {props.items.map((item) => (
        <SidebarItem
          key={item.title}
          title={item.title}
          selected={
            item.title.toLowerCase() === location.pathname.split("/")[1]
          }
          icon={item.icon}
        />
      ))}
      <div className="doc-and-whitepaper-container">
        <SidebarItem
          title="Documentation"
          selected={false}
          icon="documentation"
          isExternalLink={true}
          externalHref="https://docs.honey.finance/"
        />
        <SidebarItem
          title="Whitepaper"
          selected={false}
          icon="whitepaper"
          isExternalLink={true}
          externalHref="https://honeylabs.medium.com/whitepaper-peer-to-contract-nft-collateral-and-lending-fdd6054328b0"
        />
      </div>
      <div className="sidebar-social">
        {props.socials.map((item: TSocial) => (
          <a target="_blank" rel="noreferrer" key={item.icon} href={item.link}>
            <IconLoader icon={item.icon} />
          </a>
        ))}
      </div>
    </BodyWrapper>
  );
};

export default Sidebar;
