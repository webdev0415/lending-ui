import React, { useEffect, useState } from "react";
import { AssetsTable } from "../../components/AssetsTable";
import { ChoiceRenderer } from "../../components/ChoiceRenderer";
import { Withdraw } from "./components";
import Deposit from "./components/Deposit/Deposit";
import "./lend-page.scss";
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { Amount, JetClient, JetMarket, JetReserve, JetUser } from "../../jet";
import Button from "../../components/Button/Button";
import { MathWallet, SlopeWallet, SolongWallet, Wallet, WalletProvider } from "../../helpers/walletType";
import { getWalletAndAnchor } from "../../helpers/connectWallet";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getAssetPubkeys, getReserveStructures } from "../../helpers/jet/jet";
import { AssetStore, IdlMetadata, Market, Reserve, User } from "../../helpers/jet/JetTypes";
import { getAccountInfoAndSubscribe, getMintInfoAndSubscribe, getTokenAccountAndSubscribe, parseIdlMetadata, parseMarketAccount, parseReserveAccount } from "../../helpers/jet/programUtil";
import { Program } from "@project-serum/anchor";
import { getEmptyMarketState } from "./getEmptyMarket";
import { getEmptyUserState } from "./getEmptyUser";
import { MarketReserveInfoList } from "../../helpers/jet/layout";
import { deriveValues } from "../../helpers/jet/subscribe";
import { TokenAmount } from "../../helpers/jet/util";
import { parsePriceData } from "@pythnetwork/client";
import TitleText from "../../components/TitleText/TitleText";
import { BodyWrapper } from "../../components/BodyWrapper";
import BodyText from "../../components/BodyText/BodyText";

const idl = require('./../../idl/localnet/jet.json');

export interface LendPageProps {
  walletApp: any
}

const LendPage = (props: LendPageProps) => {

  const providers: WalletProvider[] = [
    {
      name: "Phantom",
      logo: "img/wallets/phantom.png",
      url: "https://phantom.app/"
    },
    {
      name: "Slope",
      logo: "img/wallets/slope.png",
      url: "https://slope.finance/"
    },
    {
      name: "Solflare",
      logo: "img/wallets/solflare.png",
      url: "https://solflare.com/"
    },
    {
      name: "Solong",
      logo: "img/wallets/solong.png",
      url: "https://solongwallet.com/"
    },
    {
      name: "Sollet",
      logo: "img/wallets/sollet.png",
      url: "https://www.sollet.io/"
    },
    {
      name: "Math Wallet",
      logo: "img/wallets/math_wallet.png",
      url: "https://mathwallet.org/en-us/"
    }
  ];

  const [jetClient, setJetClient] = useState<JetClient>();
  const [jetMarket, setJetMarket] = useState<JetMarket>();
  const [jetUser, setJetUser] = useState<JetUser>();
  const [jetReserve, setJetReserve] = useState<JetReserve>();
  const [anchorCoder, setAnchorCoder] = useState<anchor.Coder>();
  const [reserveStructures, setReserveStructures] = useState<Record<string, Reserve>>();
  const [connection, setConnection] = useState<Connection>();
  const [idlMetadata, setIdlMetadata] = useState<IdlMetadata>();
  const [market, setMarket] = useState<Market>(getEmptyMarketState());
  const [user, setUser] = useState<User>(getEmptyUserState());
  const [program, setProgram] = useState<Program>();


  type allWallet = Wallet | SolongWallet | MathWallet | SlopeWallet;

  const [wallet, setWallet] = useState<allWallet>();

  useEffect(() => {
    const fetchWallet = async () => {
      const provider = providers[0]; // hardcoded for Phatom now.
      const wallet = await getWalletAndAnchor(provider);
      setWallet(wallet);
      setUser(prev => ({
        ...prev,
        wallet: wallet
      }))
    }
    fetchWallet();
  });

  useEffect(() => {
    if(!idlMetadata) {
      console.log("setup failed");
      return
    }

    const fetchReserves = async () => {
      const reserveStructures: Record<string, Reserve> = await getReserveStructures(idlMetadata);
      setReserveStructures(reserveStructures);
      setMarket(current => ({
        ...current,
        accountPubkey: idlMetadata.market.market,
        authorityPubkey: idlMetadata.market.marketAuthority,
        reserves: reserveStructures,
        currentReserve: reserveStructures.SOL,
      }));
    }

    fetchReserves();
  }, [idlMetadata, setMarket]);

  useEffect(() => {
    if (!connection){
      console.log("setup failed");
      return
    }
      
    // setup coder for anchor operations
    const setup = async () => {
      const idl = require('./../../idl/localnet/jet.json');
      const idlMetadata = parseIdlMetadata(idl.metadata as IdlMetadata);
      setAnchorCoder(new anchor.Coder(idl));
      setIdlMetadata(idlMetadata);
      const provider = new anchor.Provider(connection, wallet as unknown as anchor.Wallet, anchor.Provider.defaultOptions());
      const program: Program = new anchor.Program(idl, (new anchor.web3.PublicKey(idl.metadata.address)), provider);
      setProgram(program);  
    };
    setup();
  }, [connection, wallet])

  useEffect(() => {
    if(!wallet || !market || !user || !program){
      console.log("fetch assets failed");
      return
    }
      
    const fetchAssets = async () => {
      const assetStore: AssetStore | null = await getAssetPubkeys(market, user, program);
      setUser(current => ({
        ...current,
        assets: assetStore
      }));
    }
    fetchAssets();

  }, [market.rerender, wallet, user.rerender, setUser, program])

  useEffect(() => {
    // TODO cleanup clusters being used
    // mainnet
    // let cluster = 'https://withered-delicate-bird.solana-mainnet.quiknode.pro/59cfd581e09e0c25b375a642f91a4db010cf27f6/';
    // devnet
    // let cluster = 'https://api.devnet.solana.com';
    // localnet
    let cluster = "http://127.0.0.1:8899";
    const connection = new Connection(cluster, anchor.Provider.defaultOptions().commitment);
    setConnection(connection);
  }, [])

  useEffect(() => {
    if(!wallet || !idlMetadata || !connection)
      return

    const provider = new anchor.Provider(connection, wallet as unknown as anchor.Wallet, anchor.Provider.defaultOptions());
    const fetchJetClient = async () => {
      const jetClient: JetClient = await JetClient.connect(provider, true);
      setJetClient(jetClient);
      const markets = idlMetadata.market.market;
      const jetMarketPubKey: PublicKey = new PublicKey(markets);
      const jetMarket: JetMarket = await JetMarket.load(jetClient, jetMarketPubKey);
      setJetMarket(jetMarket);
      // Setup User
      // USDC
      const reserveAddress = idlMetadata.reserves[0].accounts.reserve;
      const reserveAccounts =  idlMetadata.reserves[0].accounts;
      reserveAccounts['market'] = idlMetadata.market.market;
      const jetReserve: JetReserve = new JetReserve(jetClient, jetMarket, reserveAddress, reserveAccounts);

      // SOL
      const reserveAddress1 = idlMetadata.reserves[1].accounts.reserve;
      const reserveAccounts1 =  idlMetadata.reserves[1].accounts;
      reserveAccounts1['market'] = idlMetadata.market.market;
      const jetReserve1: JetReserve = new JetReserve(jetClient, jetMarket, reserveAddress1, reserveAccounts1);

      // BTC
      const reserveAddress2 = idlMetadata.reserves[2].accounts.reserve;
      const reserveAccounts2 =  idlMetadata.reserves[2].accounts;
      reserveAccounts2['market'] = idlMetadata.market.market;
      const jetReserve2: JetReserve = new JetReserve(jetClient, jetMarket, reserveAddress2, reserveAccounts2);

      // ETH
      const reserveAddress3 = idlMetadata.reserves[3].accounts.reserve;
      const reserveAccounts3 =  idlMetadata.reserves[3].accounts;
      reserveAccounts3['market'] = idlMetadata.market.market;
      const jetReserve3: JetReserve = new JetReserve(jetClient, jetMarket, reserveAddress3, reserveAccounts3);

      const reserves: JetReserve[] = [jetReserve, jetReserve1, jetReserve2, jetReserve3];
      const jetUser: JetUser = await JetUser.load(jetClient, jetMarket, new PublicKey(wallet.publicKey), reserves);
      setJetUser(jetUser);

      setJetReserve(jetReserve);
    }
    // load jet
    fetchJetClient();

  }, [wallet, connection, idlMetadata]);

  // Get Market Info
  // useEffect(() => {
  //   if (!connection || !idlMetadata || !anchorCoder || Object.keys(market.reserves).length === 0 || !user)
  //     return

  //   const subscribeToMarket = async () => {
  //     let promise: Promise<number>;
  //     const promises: Promise<number>[] = [];
  
  //     promise = getAccountInfoAndSubscribe(connection, idlMetadata?.market.market, account => {
  //       if(account != null) {
  //         console.assert(MarketReserveInfoList.span == 12288);
  //         const decoded = parseMarketAccount(account.data, anchorCoder);
  //         for (const reserveStruct of decoded.reserves) {
  //           for (const abbrev in market.reserves) {
  //             if (market.reserves[abbrev].accountPubkey.equals(reserveStruct.reserve)) {
  //               const reserve = market.reserves[abbrev];
  
  //               reserve.liquidationPremium = reserveStruct.liquidationBonus;
  //               reserve.depositNoteExchangeRate = reserveStruct.depositNoteExchangeRate;
  //               reserve.loanNoteExchangeRate = reserveStruct.loanNoteExchangeRate;
  
  //               let [newMarket, newUser, newAsset] = deriveValues(reserve, market, user, user.assets?.tokens[reserve.abbrev]); 
  //               setUser(newUser as User);
  //               setMarket(newMarket as Market)
  //             }
  //           }
  //         }
  //       }
  //     });

  //     for (const reserveMeta of idlMetadata.reserves) {
  //       // Reserve
  //       promise = getAccountInfoAndSubscribe(connection, reserveMeta.accounts.reserve, account => {
  //         if (account != null) {
  //           const decoded = parseReserveAccount(account.data, anchorCoder);

  //           // Hardcoding min c-ratio to 130% for now
  //           // market.minColRatio = decoded.config.minCollateralRatio / 10000;

  //           const reserve = market.reserves[reserveMeta.abbrev];

  //           reserve.maximumLTV = decoded.config.minCollateralRatio;
  //           reserve.liquidationPremium = decoded.config.liquidationPremium;
  //           reserve.outstandingDebt = new TokenAmount(decoded.state.outstandingDebt, reserveMeta.decimals).divb(new anchor.BN(Math.pow(10, 15)));
  //           reserve.accruedUntil = decoded.state.accruedUntil;
  //           reserve.config = decoded.config;

  //           let [newMarket, newUser, newAsset] = deriveValues(reserve, market, user, user.assets?.tokens[reserve.abbrev]); 
  //           setUser(newUser as User);
  //           setMarket(newMarket as Market)
  //         }
  //       });
  //       promises.push(promise);

  //       // Deposit Note Mint
  //       promise = getMintInfoAndSubscribe(connection, reserveMeta.accounts.depositNoteMint, amount => {
  //         if (amount != null) {
  //           let reserve = market.reserves[reserveMeta.abbrev];
  //           reserve.depositNoteMint = amount;

  //           let [newMarket, newUser, newAsset] = deriveValues(reserve, market, user, user.assets?.tokens[reserve.abbrev]); 
  //           setUser(newUser as User);
  //           setMarket(newMarket as Market)
  //         }
  //       });
  //       promises.push(promise);

  //       // Loan Note Mint
  //       promise = getMintInfoAndSubscribe(connection, reserveMeta.accounts.loanNoteMint, amount => {
  //         if (amount != null) {
  //           let reserve = market.reserves[reserveMeta.abbrev];
  //           reserve.loanNoteMint = amount;

  //           let [newMarket, newUser, newAsset] = deriveValues(reserve, market, user, user.assets?.tokens[reserve.abbrev]); 
  //           setUser(newUser as User);
  //           setMarket(newMarket as Market)
  //         }
  //       });
  //       promises.push(promise);

  //       // Reserve Vault
  //       promise = getTokenAccountAndSubscribe(connection, reserveMeta.accounts.vault, reserveMeta.decimals, amount => {
  //         if (amount != null) {
  //           let reserve = market.reserves[reserveMeta.abbrev];
  //           reserve.availableLiquidity = amount;

  //           let [newMarket, newUser, newAsset] = deriveValues(reserve, market, user, user.assets?.tokens[reserve.abbrev]); 
  //           setUser(newUser as User);
  //           setMarket(newMarket as Market)
  //         }
  //       });
  //       promises.push(promise);

  //       // Reserve Token Mint
  //       promise = getMintInfoAndSubscribe(connection, reserveMeta.accounts.tokenMint, amount => {
  //         if (amount != null) {
  //           let reserve = market.reserves[reserveMeta.abbrev];
  //           reserve.tokenMint = amount;

  //           let [newMarket, newUser, newAsset] = deriveValues(reserve, market, user, user.assets?.tokens[reserve.abbrev]); 
  //           setUser(newUser as User);
  //           setMarket(newMarket as Market)
  //         }
  //       });
  //       promises.push(promise);

  //       // Pyth Price
  //       promise = getAccountInfoAndSubscribe(connection, reserveMeta.accounts.pythPrice, account => {
  //         if (account != null) {
  //           let reserve = market.reserves[reserveMeta.abbrev];
  //           reserve.price = parsePriceData(account.data).price || 0;

  //           let [newMarket, newUser, newAsset] = deriveValues(reserve, market, user, user.assets?.tokens[reserve.abbrev]); 
  //           setUser(newUser as User);
  //           setMarket(newMarket as Market)
  //         }
  //       });
  //       promises.push(promise);
  //     }
  //     await Promise.all(promises);
  //   }
  //   subscribeToMarket();
  // }, [connection, idlMetadata, anchorCoder, market.rerender, user.rerender, setMarket, setUser]);

  // Lend Actions
  const deriveAssociatedTokenAccount = async (tokenMint : PublicKey) => {
    if (!jetUser || ! wallet){
      console.log(`Jet User: ${jetUser} or wallet ${wallet} is undefined`)
      return
    }

    const associatedTokenAccount: PublicKey = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(tokenMint),
      new PublicKey(wallet.publicKey)
    );
    if (!associatedTokenAccount)
      console.log("Associated Token Account could not be located");
    return associatedTokenAccount;
  }

  const onDeposit = async (tokenAmount: number, tokenName: string) => {
    try {
      if (!jetUser || !jetReserve)
        return;
      const tokenReserveDetails = idl.metadata.reserves.find((reserve: Reserve) => reserve.name === tokenName);
      const tokenMint = tokenReserveDetails.accounts.tokenMint;

      const associatedTokenAccount: PublicKey | undefined = await deriveAssociatedTokenAccount(tokenMint);
      const reserve = jetUser.reserves.find(reserve => reserve.data.tokenMint.toString() === tokenMint) || jetReserve;
      const amount = Amount.tokens(tokenAmount);

      if (associatedTokenAccount) {
        const depositSlip = await jetUser.deposit(reserve, associatedTokenAccount, amount);
        console.log(depositSlip);  
      }      
    } catch (error) {
      console.log(error)
    }
  }

  const onDepositCollateral = async () => {
    if (!jetUser || !jetReserve)
      return;
    const depositCollateral = await jetUser.depositCollateral(jetReserve, Amount.tokens(1));
  }

  const onWithdraw = async (tokenAmount: number, tokenName: string) => {
    try {
      if (!jetUser || !jetReserve) 
        return; 
      const tokenReserveDetails = idl.metadata.reserves.find((reserve: Reserve) => reserve.name === tokenName);
      const tokenMint = tokenReserveDetails.accounts.tokenMint;

      const associatedTokenAccount: PublicKey | undefined = await deriveAssociatedTokenAccount(tokenMint);
      const reserve = jetUser.reserves.find(reserve => reserve.data.tokenMint.toString() === tokenMint) || jetReserve;
      const amount = Amount.tokens(tokenAmount);

      if (associatedTokenAccount) {
        const abbrev = "USDC" // TODO: determine dynamically
        const withdrawSlip = await jetUser.withdraw(reserve, associatedTokenAccount, amount, user, abbrev);
        console.log(withdrawSlip);
      }      
    } catch (error) {
      console.log(error)
    }
  }

  const onWithdrawCollateral = async () => {
    if (!jetUser || !jetReserve)
      return;
    await jetUser.refresh()
    await jetReserve.refresh();
    const depositCollateral = await jetUser.withdrawCollateral(jetReserve, Amount.tokens(1));
    console.log(depositCollateral);
  }

  const onBorrow = async () => {
    if (!jetUser || !jetReserve)
      return;
    const amount = Amount.tokens(1);
    const tokenAccount = user.assets?.tokens["USDC"].walletTokenPubkey
    if (tokenAccount) {
      const abbrev = "USDC";
      const borrow = await jetUser.borrow(jetReserve, tokenAccount, amount, user, abbrev);
      console.log(borrow);  
    }
  }

  const onRepay = async () => {
    if (!jetUser || !jetReserve)
      return;
    const amount = Amount.tokens(1);
    const associatedTokenAccount: PublicKey | undefined = await deriveAssociatedTokenAccount(new PublicKey("BaG7E1MjrMmnke8ZPasPyGUZLaJjPQpEou75yaG6HFAi"));
    if (associatedTokenAccount) {
      const repay = await jetUser.repay(jetReserve, associatedTokenAccount, amount)
      console.log(repay);  
    }
  }

  const onPrintUser = () => {
    console.log(user);
  }

  const onPrintMarket = () => {
    console.log(market);
  }

  const [depositOrWithdraw, setDepositOrWithdraw] = useState(0);

  return (
    <div className="lend-page-container">
      <div className="lend-page-asset">
      <div className="market-overview-container">
          <TitleText>Market overview</TitleText>
          <BodyWrapper className="overview-box">
            <div className="stat-set">
              <BodyText light>Total supply</BodyText>
              <BodyText>$0</BodyText>
            </div>
            <div className="stat-set">
              <BodyText light>Total borrow</BodyText>
              <BodyText>$0</BodyText>
            </div>
            <div className="stat-set">
              <BodyText light>Total supply</BodyText>
              <BodyText>$0</BodyText>
            </div>
          </BodyWrapper>
        </div>
        <div className="all-markets-container">
          <TitleText>All markets</TitleText>
          <AssetsTable
            assets={[
              {
                icon: "solana",
                title: "SOL",
                price: 358.2,
                volume: 2445567,
                supplyApy: 15.5,
                borrowApy: 15.5,
              },
              {
                icon: "usdc",
                title: "USDC",
                price: 1.00,
                volume: 2445567,
                supplyApy: 15.5,
                borrowApy: 15.5,
              },
            ]}
          />
        </div>
        {/* <Button 
          title="Deposit"
          onClick={() => onDeposit()}
        ></Button>
        <Button 
          title="Deposit Collateral"
          onClick={() => onDepositCollateral()}
        ></Button>
        <Button 
          title="Withdraw"
          onClick={() => onWithdraw()}
        ></Button>
        <Button 
          title="Withdraw Collateral"
          onClick={() => onWithdrawCollateral()}
        ></Button>
        <Button 
          title="Borrow"
          onClick={() => onBorrow()}
        ></Button>
        <Button 
          title="Repay"
          onClick={() => onRepay()}
        ></Button>
        <Button 
          title="Print User"
          onClick={() => onPrintUser()}
        ></Button>
        <Button 
          title="Print Market"
          onClick={() => onPrintMarket()}
        ></Button> */}
      </div>

      <div className="withdraw-and-deposit-container">
      <ChoiceRenderer
        selected={depositOrWithdraw}
        changeHandler={(index: number) => setDepositOrWithdraw(index)}
        components={[
          {
            title: "Deposit",
            component: (
              <Deposit
                supplyApy={4.2}
                honeyReward={12.2}
                netApy={16.4}
                onDeposit={onDeposit}
              />
            ),
          },
          {
            title: "Withdraw",
            component: (
              <Withdraw
                supplyApy={4.2}
                honeyReward={12.2}
                netApy={16.4}
                onWithdraw={onWithdraw}
              />
            ),
          },
        ]}
      />
      </div>
    </div>
  );
};

export default LendPage;