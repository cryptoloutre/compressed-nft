import { createMerkleTree } from "./utils/createTree";
import { createCollection } from "./utils/createcollection";
import * as fs from "fs";
import { isValidDepthSizePair } from "./utils/isValidDepthSizePair";

async function createTreeAndCollection() {

  if (!isValidDepthSizePair()) {
    console.log("Invalid maxDepth/maxBufferSize pair!");
    return
  }

  const treeAddress = await createMerkleTree();
  const collectionMint = await createCollection();

  const info = {
    treeAddress: treeAddress,
    collectionMint: collectionMint
  };

  const data = JSON.stringify(info);
  fs.writeFileSync("info.json", data);
  console.log("Useful info successfuly stored!");
}

createTreeAndCollection();
