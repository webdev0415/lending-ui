import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as SPLToken from "@solana/spl-token";
import { programs } from "@metaplex/js";
import { programIds } from "./ids";

const extractMetaData = async (NFT: any, isStaked: boolean, connection: Connection) => {
  try {
    const accountInfo = SPLToken.AccountLayout.decode(NFT.account.data);
    
    if (accountInfo.amount[0] > 0) {
      const tokenmetaPubkey = await programs.metadata.Metadata.getPDA(new PublicKey(accountInfo.mint));
      const tokenmeta = await programs.metadata.Metadata.load(connection, tokenmetaPubkey);

      if (tokenmeta.data.data.uri !== "") {
        let nftMetaData = await (await fetch(tokenmeta.data.data.uri)).json();
        nftMetaData.tokenId = tokenmetaPubkey;
        nftMetaData.updateAuthority = tokenmeta.data.updateAuthority;
        nftMetaData.isStake = isStaked;
        nftMetaData.tokacc = NFT.pubkey;
        nftMetaData.updateAuthority = tokenmeta.data.updateAuthority;
        console.log(nftMetaData);
        return nftMetaData;
      }
    }
  } catch (error) {
    console.log(error);
    console.log("Error extracting meta data");
  }
}

export async function fetAllNFTForAccount(walletAddress: string, connection: Connection) {
  const AllNFTData = [];

  try {
    let response = await connection.getTokenAccountsByOwner(
      new PublicKey(walletAddress), { programId: TOKEN_PROGRAM_ID, }
    );


    let promises = response.value.map(async (NFT) => {
      return await extractMetaData(NFT, false, connection);
    });


    for await (let val of promises) {
      if (val !== undefined) {
        AllNFTData.push(val);
      }
    }
    console.log("all nfts fected:",AllNFTData);
    return AllNFTData;

  } catch (error) {
    console.log(error)
    return [];
  }
}

export async function getStakedNFT(walletAddress: string, connection: Connection) {
  const StakedNFTData: any[] = [];
  const QUARRY_KEYS = programIds().farm.QUARRY_KEYS;
  const MINE_PROGRAM_ID = programIds().farm.MINE_PROGRAM_ID;
  for (let i = 0; i < QUARRY_KEYS.length; i++) {
    const [minerAdd, bump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("Miner"),
        (new PublicKey(QUARRY_KEYS[i])).toBuffer(),
        (new PublicKey(walletAddress)).toBuffer(),
      ],
      new PublicKey(MINE_PROGRAM_ID)
    );
  
    let response = await connection.getTokenAccountsByOwner(
      minerAdd, { programId: TOKEN_PROGRAM_ID, }
    );

    let promises = response.value.map(async (NFT) => {
      return await extractMetaData(NFT, true, connection);
    });

    const NFTs = [];

    for await (let val of promises) {
      if (val !== undefined) {
        NFTs.push(val);
      }
    }

    StakedNFTData.push(...NFTs)
  }
  console.log("Staked nfts fetched", StakedNFTData);
  return StakedNFTData

}