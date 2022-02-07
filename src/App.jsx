import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import walletOptions from "./helpers/connectWallet";
import { DashboardPage, LendPage } from "./pages";
import ConnectWalletPage from "./pages/ConnectWalletPage/ConnectWalletPage";
import FarmPage from "./pages/FarmPage/FarmPage";
import { fetAllNFTForAccount, getStakedNFT } from "./helpers/Nfts";
import "./sass/global.scss";
import { PublicKey } from "@solana/web3.js";
import DepositCollateralPage from "./pages/BorrowPage/DepositCollateralPage";
import CollateralPortfolioPage from "./pages/BorrowPage/CollateralPortfolioPage";
import GovernancePage from "./pages/GovernancePage/GovernancePage";
import { useConnection } from "./contexts/connection";

export const AllNFTsContext = React.createContext();

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletApp, setWalletApp] = useState(null);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [AllNFT, setAllNFT] = useState([]);
  const [testNFT, setTestNFT] = useState([]);
  const [WalletType, setWalletType]=useState("");
  const [isLoading, setIsLoading] = useState({
    dashboard: true,
    Farm: false,
  });
  const connection = useConnection();

  const checkIfWalletConnected = async () => {
    try {
      const lastConnectedWalletType = window.localStorage.getItem(
        "lastConnectedWalletType"
      );
      if (!lastConnectedWalletType) return;
      const wallet = walletOptions.find(
        (wallet) => wallet.name === lastConnectedWalletType
      );
      const walletConnected = await wallet.connect();
      setWalletAddress(walletConnected.publicKey.toString());
      setWalletApp(walletConnected);
      setWalletType(lastConnectedWalletType);
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    const connectedWallet = walletOptions.find(wallet => wallet.name === WalletType);
    await connectedWallet.disconnect();
    window.localStorage.removeItem( "lastConnectedWalletType" );
    setWalletAddress(null);
    setWalletApp(null);
    setWalletType("")
  }

  const updateNFTs = useCallback( async () => {
    await Promise.all([
      fetAllNFTForAccount(walletAddress, connection),
      getStakedNFT(walletAddress, connection),
    ]).then((values) => {
      setTestNFT([...values[0], ...values[1]])
      setAllNFT([...values[0], ...values[1]]);
      setIsLoading({
        dashboard: false,
        Farm: false,
      });
      return values;
    }).catch( error => {
      console.log("Error updating NFTs")
      throw error;
    })
  }, [connection, walletAddress])

  const toggleNFTStakeStatus = (tokenId) => {
    const newAllNFTs = [];
    for(let i=0; i<AllNFT.length; i++){
      const NFTPubKey = new PublicKey(AllNFT[i].tokenId).toString();
      if(NFTPubKey === new PublicKey(tokenId).toString()){
        newAllNFTs.push({...AllNFT[i], isStake: !AllNFT[i].isStake})
      }else{
        newAllNFTs.push(AllNFT[i])
      }
    }
    setAllNFT(newAllNFTs)
  }

  
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (!walletAddress) return;
    updateNFTs()
  }, [walletAddress, updateNFTs]);

  if (!walletAddress)
    return (
      <ConnectWalletPage
        setWalletAddress={setWalletAddress}
        setWalletApp={setWalletApp}
        setWalletType={setWalletType}
      />
    );

  return isLoading.dashboard ? (
    <div className="loading-indicator">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ) : (
    <AllNFTsContext.Provider value={{ AllNFT, updateNFTs, toggleNFTStakeStatus}}>
      <div
        onClick={() => (showSidebarMobile ? setShowSidebarMobile(false) : null)}
        className="application-wrapper"
      >
        <Sidebar
          title="Honey Finance"
          items={[
            { title: "Dashboard", icon: "dashboard" },
            { title: "Borrow", icon: "borrow" },
            { title: "Lend", icon: "lend" },
            { title: "Farm", icon: "farm" },
            { title: "Governance", icon: "governance"}
          ]}
          socials={[
            { link: "https://discord.gg/HtvT939VgY", icon: "discord" },
            { link: "https://twitter.com/honeydefi", icon: "twitter" },
            { link: "https://blog.honey.finance", icon: "medium" },
            { link: "https://github.com/honey-labs", icon: "github" },
          ]}
          className={`${showSidebarMobile ? "sidebar-mobile-show" : ""}`}
        />
        <div
          className={`layout-grid ${showSidebarMobile ? "layout-grid-mobile-blur" : ""
            }`}
        >
          <Topbar
            infoText="⚠️ This product is in Beta - Borrow/Lend values are placeholders"
            address={walletAddress}
            onMobileToggle={() => setShowSidebarMobile(true)}
            disconnectWallet={disconnectWallet}
          />
          <div className="page-content">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage walletApp={walletApp} />} />
              <Route
                path="/borrow/deposit"
                element={
                  <DepositCollateralPage
                    AllNFT={AllNFT}
                    isLoading={isLoading}
                    walletApp={walletApp}
                  />
                }
              />
              <Route
                path="/borrow/portfolio"
                element={
                  <CollateralPortfolioPage
                    AllNFT={AllNFT}
                    isLoading={isLoading}
                    walletApp={walletApp}
                  />
                }
              />
              <Route path="/borrow" element={<Navigate replace to="/borrow/deposit" />} />
              <Route path="/lend" element={<LendPage 
                  walletApp={walletApp}
                />}
               />
              <Route
                path="/farm"
                element={
                  <FarmPage
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    walletApp={walletApp}
                    testNFT={testNFT}
                    WalletType={WalletType}
                  />
                }
              />
              <Route
                path="/governance"
                element={
                  <GovernancePage
                  />
                }
              />
              <Route path="/" element={<Navigate replace to="/dashboard" />} />
            </Routes>
          </div>
        </div>
        </div>
      </AllNFTsContext.Provider>
  );
};

export default App;
