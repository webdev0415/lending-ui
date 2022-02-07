import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';
import { getATAAddress, TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token
} from "@solana/spl-token";
import { programIds } from './ids';
import { programIdls } from './idls';

const findMinerAddress = async (
  quarry,
  authority,
  programId
) => {
  console.log(quarry);
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("Miner"),
      quarry.toBuffer(),
      authority.toBuffer(),
    ],
    programId
  );
}

const getMiner = async (
  quarrykey,
  authority,
  program
) => {
  try {
    const programID = new PublicKey(programIds().farm.MINE_PROGRAM_ID);
    const [key] = await findMinerAddress(
      quarrykey,
      authority,
      programID
    );
    return await program.account.miner.fetch(
      key
    );
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const getNFTstaked = async (
  quarrykey,
  walletApp,
  connection
) => {
  const programID = new PublicKey(programIds().farm.MINE_PROGRAM_ID);
  const idl = programIdls().farm;
  const provider = new Provider(connection, walletApp,);
  const program = new Program(idl, programID, provider);
  try {
    const quarry = await program.account.quarry.fetch(
      quarrykey
    );
    console.log(quarry.totalTokensDeposited);
    return quarry.totalTokensDeposited.toString()    
  } catch (err) {
    console.log(err);
    return null;
  }
}


const performStakeAction = async (
  authority,
  miner,
  quarrykey,
  rewarderkey,
  minerAssAccVault,
  NftATA,
  NFTMetadata,
  NFTMint,
  amount,
  metadata_bump,
  program
) => {
  const instruction = program.instruction.stakeNft(amount, metadata_bump, {
    accounts: {
      authority: authority,
      miner: miner,
      quarry: quarrykey,
      rewarder: rewarderkey,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenAccount: NftATA,
      minerNftVault: minerAssAccVault,
      tokenMetadata: NFTMetadata,
      tokenMint: NFTMint
    }
  });
  console.log(instruction);
  return instruction;
}

const performUnstakeAction = async (
  authority,
  miner,
  quarrykey,
  rewarderkey,
  minerAssAccVault,
  NftATA,
  NFTMetadata,
  NFTMint,
  amount,
  metadata_bump,
  program
) => {
  const instruction = program.instruction.withdrawNft(amount, metadata_bump, {
    accounts: {
      authority: authority,
      miner: miner,
      quarry: quarrykey,
      rewarder: rewarderkey,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenAccount: NftATA,
      minerNftVault: minerAssAccVault,
      tokenMetadata: NFTMetadata,
      tokenMint: NFTMint
    }
  });
  console.log(instruction);
  return instruction;
}

const stakeNFT = async (
  NFTMint,
  authority,
  quarrykey,
  rewarderKey,
  NFTMetadata,
  NftupdateAuthority,
  metadata_bump,
  provider,
  program,
  WalletType,
  tokacc,
  connection
) => {

  const programID = new PublicKey(programIds().farm.MINE_PROGRAM_ID);
  const [minerAdd, bump] = await findMinerAddress(
    quarrykey,
    authority,
    programID
  );

  console.log(minerAdd);

  const payer = authority;

  let createMinerIX;
  if (await connection.getAccountInfo(minerAdd)) {
    createMinerIX = null;
  } else {
    createMinerIX = program.instruction.createMiner(bump, {
      accounts: {
        authority: authority,
        miner: minerAdd,
        quarry: quarrykey,
        rewarder: rewarderKey,
        systemProgram: SystemProgram.programId,
        payer: payer,
        tokenProgram: TOKEN_PROGRAM_ID,
        nftUpdateAuthority: NftupdateAuthority
      }
    });
  }

  console.log(createMinerIX);

  const minerAssAccVault = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    NFTMint,
    minerAdd,
    true
  );

  console.log(minerAssAccVault);

  let createATAIX;
  if (await connection.getAccountInfo(minerAssAccVault)) {
    createATAIX = null;
  } else {
    createATAIX = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      NFTMint,
      minerAssAccVault,
      minerAdd,
      payer
    );
  }

  console.log(createATAIX);

  const transaction = new Transaction();
  transaction.feePayer = payer;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;

  if (createMinerIX) {
    transaction.add(createMinerIX);
    console.log(createMinerIX);
  }

  if (createATAIX) {
    transaction.add(createATAIX);
    console.log(transaction);
  }

  const NftATA = await getATAAddress({
    mint: NFTMint,
    owner: authority,
  });

  console.log(NftATA.toBase58());
  console.log(tokacc.toBase58());

  if(NftATA.toBase58()!==tokacc.toBase58()){
    const createNftATAIX = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      NFTMint,
      NftATA,
      authority,
      payer
    );
    transaction.add(createNftATAIX);
    console.log(createNftATAIX);

    const transferIx = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      tokacc,
      NftATA,
      authority,
      [],
      1
    );

    transaction.add(transferIx);
    console.log(transferIx);

    const closeIx = Token.createCloseAccountInstruction(
      TOKEN_PROGRAM_ID,
      tokacc,
      authority,
      authority,
      []
    )

    transaction.add(closeIx);
    console.log(closeIx);
  }

  console.log(NftATA);

  const amount = 1;

  let createstakeTX = await performStakeAction(authority, minerAdd, quarrykey, rewarderKey, minerAssAccVault, NftATA, NFTMetadata, NFTMint, amount, metadata_bump, program);
  transaction.add(createstakeTX);
  let signedTransaction;
  console.log(WalletType);
  if(WalletType === "Phantom"){console.log("hi"); signedTransaction = await window.solana.signTransaction(transaction);}
  else if(WalletType === "Solflare"){signedTransaction = await window.solflare.signTransaction(transaction);}  
  const stakeTX = await connection.sendRawTransaction(signedTransaction.serialize());
  console.log(stakeTX);
  const confirm = await connection.confirmTransaction(stakeTX, "processed");
  console.log(confirm);
}

export async function unstakeNFT(
  NFTMint,
  authority,
  quarrykey,
  rewarderKey,
  NFTMetadata,
  metadata_bump,
  provider,
  program,
  WalletType,
  connection
) {

  let miner = await getMiner(quarrykey, authority, program);
  console.log(miner);
  const programID = new PublicKey(programIds().farm.MINE_PROGRAM_ID);
  const [minerAdd, bump] = await findMinerAddress(
    quarrykey,
    authority,
    programID
  );

  console.log(bump);
  console.log(miner.bump);

  const amount = 1;

  const minerAssAccVault = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    NFTMint,
    minerAdd,
    true
  );

  const NftATA = await getATAAddress({
    mint: NFTMint,
    owner: authority,
  });

  console.log(NftATA);

  const payer = authority;

  let createNftATA;
  if (await connection.getAccountInfo(NftATA)) {
    createNftATA = null;
  } else {
    createNftATA = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      NFTMint,
      NftATA,
      authority,
      payer
    );
  }

  console.log(provider.wallet.publicKey.toBase58());

  const transaction = new Transaction();
  transaction.feePayer = provider.wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;

  if(createNftATA){
    transaction.add(createNftATA);
    console.log(createNftATA);
  }

  let createunstakeTX = await performUnstakeAction(authority, minerAdd, quarrykey, rewarderKey, minerAssAccVault, NftATA, NFTMetadata, NFTMint, amount, metadata_bump, program);
  transaction.add(createunstakeTX);
  //const { signature } = await provider.wallet.signAndSendTransaction(transaction);
  //const unstakeTX = await connection.confirmTransaction(signature);
  let signedTransaction;
  if(WalletType === "Phantom"){console.log("hi"); signedTransaction = await window.solana.signTransaction(transaction);}
  else if(WalletType === "Solflare"){signedTransaction = await window.solflare.signTransaction(transaction);}  
  const unstakeTX = await connection.sendRawTransaction(signedTransaction.serialize());
  console.log(unstakeTX);
  const confirm = await connection.confirmTransaction(unstakeTX, "processed");
  console.log(confirm);
}

export const stake = async (
  NFTMint,
  NFTMetadata,
  NFTupdateAuthority,
  metadata_bump,
  walletApp,
  quarry_key,
  WalletType,
  tokacc,
  rewarderKey,
  connection
) => {
  const provider = new Provider(connection, walletApp,);
  const programID = new PublicKey(programIds().farm.MINE_PROGRAM_ID);
  const idl = programIdls().farm;
  const program = new Program(idl, programID, provider);

  try {
    console.log(provider.wallet.publicKey);
    let authority = provider.wallet.publicKey;
    await stakeNFT(
      NFTMint,
      authority,
      new PublicKey(quarry_key),
      rewarderKey,
      NFTMetadata,
      NFTupdateAuthority,
      metadata_bump,
      provider,
      program,
      WalletType,
      tokacc,
      connection
    );
  } catch (err) {
    console.log(err);
    throw err;
  }

};

export const unstake = async (
  NFTMint,
  NFTMetadata,
  metadata_bump,
  walletApp,
  quarry_key,
  WalletType,
  rewarderKey,
  connection
) => {
  const programID = new PublicKey(programIds().farm.MINE_PROGRAM_ID);
  const idl = programIdls().farm;
  const provider = new Provider(connection, walletApp,);
  const program = new Program(idl, programID, provider);

  try {
    console.log(provider.wallet.publicKey);
    let authority = provider.wallet.publicKey;
    await unstakeNFT(
      NFTMint,
      authority,
      new PublicKey(quarry_key),
      rewarderKey,
      NFTMetadata,
      metadata_bump,
      provider,
      program,
      WalletType,
      connection
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const claimAllRewards = async (
  walletApp,
  quarry_key,
  WalletType,
  rewarderClaimTokenAccount,
  mintWrapperPDA,
  minterPDA,
  rewardsMint,
  rewarderKey,
  connection
) => {
  const provider = new Provider(connection, walletApp,);
  const programID = new PublicKey(programIds().farm.MINE_PROGRAM_ID);
  const idl = programIdls().farm;
  const program = new Program(idl, programID, provider);
  const quarryKey = new PublicKey(quarry_key);

  try {
    let authority = provider.wallet.publicKey;

    const transaction = new Transaction();
    transaction.feePayer = authority;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;

    const minerAuthRewardsTokenAcc = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(rewardsMint),
      authority,
      false
    );
    
    if (!(await connection.getAccountInfo(minerAuthRewardsTokenAcc))) {
      console.log(
        "Creating Rewards Associated Token account for Miner Authority:",
        minerAuthRewardsTokenAcc.toString()
      );

      const createRewardsAssocTokenIx =
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          rewardsMint,
          minerAuthRewardsTokenAcc,
          authority,
          authority
        );

      transaction.add(createRewardsAssocTokenIx);
    }

    console.log(
      "Claiming Rewards from staking and depositing to:",
      minerAuthRewardsTokenAcc.toString()
    );

    const [minerAdd, bump] = await findMinerAddress(
      quarryKey,
      authority,
      programID
    );

    const claimRewardsIx = program.instruction.claimRewards({
      accounts: {
        claimFeeTokenAccount: rewarderClaimTokenAccount,
        mintWrapper: mintWrapperPDA,
        mintWrapperProgram: new PublicKey("EqoPvvQbG4g7woE2HUR4rpdtpEVumDzg9KGynvPeL3Pt"),
        minter: minterPDA,
        rewardsTokenAccount: minerAuthRewardsTokenAcc,
        rewardsTokenMint: rewardsMint,
        stake: {
          authority: authority,
          miner: minerAdd,
          quarry: quarryKey,
          rewarder: rewarderKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      },
    });

    transaction.add(claimRewardsIx);

    let signedTransaction;
    if(WalletType === "Phantom"){console.log("hi"); signedTransaction = await window.solana.signTransaction(transaction);}
    else if(WalletType === "Solflare"){signedTransaction = await window.solflare.signTransaction(transaction);}  
    const claimrewards = await connection.sendRawTransaction(signedTransaction.serialize());
    console.log(claimrewards)
    const confirm = await connection.confirmTransaction(claimrewards, "processed");
    console.log(confirm);
  } catch (err) {
    console.log(err);
    throw err;
  }

};