import React, { useEffect, useRef, useState } from "react";
import { BodyWrapper } from "../BodyWrapper";

import "./topbar.scss";
import BodyText from "../BodyText/BodyText";
import { IconLoader } from "../IconLoader";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../Button/Button";

interface TopbarProps {
  infoText?: string;
  address?: string;
  onMobileToggle?: () => void;
  disconnectWallet: () => void;
}

const Topbar = (props: TopbarProps) => {
  const disconnectBtnRef = useRef(null);

  const [hideDisconnectButton, setHideDisconnectButton] = useState(true);
  const {pathname} = useLocation();

  useEffect(()=>{
    window.onclick = (event) =>{
      if ( !hideDisconnectButton && event.target !== disconnectBtnRef.current ){
        
        setHideDisconnectButton(true)
      };
    }
    return () =>{
      window.onclick = null;
    }
  }, [setHideDisconnectButton, hideDisconnectButton, disconnectBtnRef])

  return (
    <BodyWrapper className="topbar">
      <div className="topbar-left" onClick={props.onMobileToggle}>
        <IconLoader icon="menu" />
        {
          pathname.includes("/borrow") &&
          <div className="page-options-container">
            <Link to="/borrow/deposit">
              <Button className={pathname === "/borrow/deposit" ? "selected" : ""} title="Deposit" />
            </Link>
            <Link to="/borrow/portfolio">
              <Button className={pathname === "/borrow/portfolio" ? "selected" : ""} title="Portfolio" />
            </Link>
          </div>
        }
      </div>

      <div className="wallet-options-container">
        <div
          onClick={ () => setHideDisconnectButton(!hideDisconnectButton) }
          className="options-toggle"
        >
          <BodyText>
            {props.address
              ? `${props.address.slice(0, 4)}...${props.address.slice(
                  props.address.length - 4,
                  props.address.length
                )}`
              : "Connect wallet"}
          </BodyText>
        </div>
        <div
          ref={disconnectBtnRef}
          onClick={props.disconnectWallet}
          className={ `disconnect-button ${hideDisconnectButton ? "hidden" : "visible"}`}>
            <BodyText>Disconnect</BodyText>
        </div>
      </div>

    </BodyWrapper>
  );
};

export default Topbar;
