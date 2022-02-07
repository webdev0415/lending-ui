import React, { useState } from "react";
import BodyText from "../../components/BodyText/BodyText";
import Button from "../../components/Button/Button";
import ModalContainer from "../../components/ModalContainer/ModalContainer";
import TitleText from "../../components/TitleText/TitleText";
import walletOptions from "../../helpers/connectWallet";
import waveintro from "../../images/waveintro.svg";
import "./ConnectWalletPage.scss";

const ConnectWalletPage = (props) => {
  const { setWalletAddress, setWalletApp, setWalletType } = props;
  const [isWalletSelectVisible, setIsWalletSelectVisible] = useState();

  const onWalletOptionPick = async (walletName, connect) => {
    const wallet = await connect();
    window.localStorage.setItem("lastConnectedWalletType", walletName);
    setWalletApp(wallet);
    setWalletAddress(wallet.publicKey.toString());
    setWalletType(walletName);
  };

  return (
    <div className="connect-wallet-page">
      <TitleText>Honey Finance</TitleText>
      <BodyText>Enter the Hive</BodyText>
      <Button
        title="Connect wallet"
        onClick={() => setIsWalletSelectVisible(true)}
      />
      <img src={waveintro} alt="wave" className="waveintro" />
      <ModalContainer
        className="wallet-options-modal"
        isVisible={isWalletSelectVisible}
        onClose={() => setIsWalletSelectVisible(false)}
      >
        <div className="wallet-options-container">
          <TitleText>Connect wallet</TitleText>
          <div className="line" />
          {walletOptions.map(({ name, connect, icon }) => (
            <div
              key={name}
              onClick={() => onWalletOptionPick(name, connect)}
              className="wallet-option"
            >
              <BodyText>{name}</BodyText>
              <img src={icon} alt={`${name} icon`} />
            </div>
          ))}
        </div>
      </ModalContainer>
    </div>
  );
};

export default ConnectWalletPage;
