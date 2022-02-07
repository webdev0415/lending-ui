import React from "react";
import {
  BorrowIcon,
  DashboardIcon,
  DiscordIcon,
  GithubIcon,
  LendIcon,
  MediumIcon,
  MenuIcon,
  TwitterIcon,
  FarmIcon,
  DocumentationIcon,
  WhitepaperIcon,
} from "../../icons";
import solanaIcon from "../../images/solanaIcon.png";
import usdcIcon from "../../images/USDCIcon.png";
import houseAppleIcon from "../../images/houseAppleIcon.png";
import bankAppleIcon from "../../images/bankAppleIcon.png";
import moneyBagAppleIcon from "../../images/moneyBagAppleIcon.png";
import sheaftOfRiceAppleIcon from "../../images/sheafOfRiceAppleIcon.png";
import GovernanceIcon from "../../icons/GovernanceIcon";

interface IconLoaderProps {
  icon: string;
  isIconSelected?: boolean;
}

const resolveIcon = (props: IconLoaderProps): React.ReactNode => {

  switch (props.icon) {
    case "borrow":
      return <BorrowIcon isSelected={props.isIconSelected} />;
    case "dashboard":
      return <DashboardIcon  isSelected={props.isIconSelected} />;
    case "discord":
      return <DiscordIcon />;
    case "lend":
      return <LendIcon isSelected={props.isIconSelected} />;
    case "twitter":
      return <TwitterIcon />;
    case "medium":
      return <MediumIcon />;
    case "github":
      return <GithubIcon />;
    case "menu":
      return <MenuIcon />;
    case "documentation":
      return <DocumentationIcon />;
    case "whitepaper":
      return <WhitepaperIcon />;
    case "farm":
      return <FarmIcon isSelected={props.isIconSelected} />;
    case "governance":
      return <GovernanceIcon isSelected={props.isIconSelected} />;
    case "solana":
      return <img alt="solana icon" src={solanaIcon} />;
    case "usdc":
      return <img alt="usdc icon" src={usdcIcon} />;
    case "houseApple":
      return <img alt="house apple icon" src={houseAppleIcon} />;
    case "bankApple":
      return <img alt="bank apple icon" src={bankAppleIcon} />;
    case "moneyBagApple":
      return <img alt="money bag apple icon" src={moneyBagAppleIcon} />;
    case "sheafOfRiceApple":
      return <img alt="sheaf of rice apple icon" src={sheaftOfRiceAppleIcon} />;
    default:
      return <div />;
  }
};

const IconLoader = ({icon, isIconSelected = false}: IconLoaderProps) => {
  return <div>{resolveIcon({icon, isIconSelected})}</div>;
};

export default IconLoader;
