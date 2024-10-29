import {
  mintToCollectionV1,
  mplBubblegum,
} from "@metaplex-foundation/mpl-bubblegum";
import * as fs from "fs";
import { createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { collectionCreators, collectionIsMutable, collectionRoyalties, collectionSymbol, connection, privateKey } from "./config";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { setComputeUnitLimit, setComputeUnitPrice } from "@metaplex-foundation/mpl-toolbox";

async function mintCompressedNFT() {

  const info = JSON.parse(fs.readFileSync("info.json", { encoding: "utf-8" }));

  const merkleTree = publicKey(info.treeAddress);
  const collectionMint = publicKey(info.collectionMint);

  const assets = JSON.parse(
    fs.readFileSync("assets.json", { encoding: "utf-8" })
  );

  const umi = createUmi(connection).use(mplBubblegum());
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(privateKey));
  const signer = createSignerFromKeypair(umi, keypair);
  umi.use(signerIdentity(signer));
  console.log("Minting started...");
  for (let i = 0; i < assets.length; i++) {
    const leafOwner = publicKey(assets[i].receiverAddress);
    const nftName = assets[i].name;
    const nftURI = assets[i].uri;

    const tx = await mintToCollectionV1(umi, {
      leafOwner,
      merkleTree,
      collectionMint,
      metadata: {
        name: nftName,
        uri: nftURI,
        symbol: collectionSymbol,
        sellerFeeBasisPoints: collectionRoyalties * 100,
        collection: { key: collectionMint, verified: true },
        creators: collectionCreators,
        isMutable: collectionIsMutable
      },
    })
      .add(setComputeUnitLimit(umi, { units: 60000 }))
      .add(setComputeUnitPrice(umi, { microLamports: 300000 }))
      .sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });


    console.log(
      "Compressed NFT",
      i + 1,
      "/",
      assets.length,
      "successfuly minted!"
    );
    console.log("Transaction signature: ", base58.deserialize(tx.signature)[0], "\n");
  }
  console.log("Mint complete!");
}

mintCompressedNFT();
