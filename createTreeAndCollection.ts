import { Connection, Keypair } from "@solana/web3.js";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import { createTree } from "./utils/createTree";
import { createCollection } from "./utils/createcollection";
import * as fs from "fs";
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";

async function createTreeAndCollection() {
  const connection = new Connection("https://api.devnet.solana.com");

  const payerKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
      170, 253, 179, 56, 200, 101, 142, 90, 196, 51, 126, 187, 154, 219, 76, 204,
      211, 117, 129, 71, 5, 106, 16, 242, 178, 90, 10, 74, 44, 110, 121, 144, 9, 99,
      203, 120, 227, 221, 251, 160, 64, 114, 36, 140, 16, 53, 55, 8, 45, 183, 170,
      241, 163, 34, 151, 60, 92, 97, 1, 60, 54, 230, 217, 162
    ])
  );

  const maxDepthSizePair: ValidDepthSizePair = {
    maxDepth: 5,
    maxBufferSize: 8,
  };
  const canopyDepth = 2;

  const treeAddress = await createTree(
    connection,
    payerKeypair,
    maxDepthSizePair,
    canopyDepth
  );

  const collectionMetadata: CreateMetadataAccountArgsV3 = {
    data: {
      name: "Numbers collection",
      symbol: "NB",
      uri: "https://arweave.net/SFBfNncAsdfMx5TExmrm26Xx4ciq7oWUL8mjXBnnFjw",
      sellerFeeBasisPoints: 100,
      creators: [
        {
          address: payerKeypair.publicKey,
          verified: false,
          share: 100,
        },
      ],
      collection: null,
      uses: null,
    },
    isMutable: false,
    collectionDetails: {
      __kind: "V1",
      size: 0,
    },
  };

  const collectionInfo = await createCollection(
    connection,
    payerKeypair,
    collectionMetadata
  );

  const info = {
    treeAddress: treeAddress,
    collectionMint: collectionInfo.mint,
    collectionMetadata: collectionInfo.metadata,
    collectionMasterEdition: collectionInfo.masterEdition,
  };

  const data = JSON.stringify(info);
  fs.writeFileSync("info.json", data);
  console.log("Useful info successfuly stored!");
}

createTreeAndCollection();
