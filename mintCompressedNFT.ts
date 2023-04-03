import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
  createMintToCollectionV1Instruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import * as fs from "fs";

async function mintCompressedNFT() {
  const connection = new Connection("https://api.devnet.solana.com");

  const payerKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
        170, 253, 179, 56, 200, 101, 142, 90, 196, 51, 126, 187, 154, 219, 76, 204,
        211, 117, 129, 71, 5, 106, 16, 242, 178, 90, 10, 74, 44, 110, 121, 144, 9, 99,
        203, 120, 227, 221, 251, 160, 64, 114, 36, 140, 16, 53, 55, 8, 45, 183, 170,
        241, 163, 34, 151, 60, 92, 97, 1, 60, 54, 230, 217, 162
      ])
  );

  const info = JSON.parse(fs.readFileSync("info.json", { encoding: "utf-8" }));

  const treeAddress = new PublicKey(info.treeAddress);
  const collectionMint = new PublicKey(info.collectionMint);
  const collectionMetadata = new PublicKey(info.collectionMetadata);
  const collectionMasterEdition = new PublicKey(info.collectionMasterEdition);

  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeAddress.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi")],
    BUBBLEGUM_PROGRAM_ID
  );

  const assets = JSON.parse(
    fs.readFileSync("assets.json", { encoding: "utf-8" })
  );

  console.log("Minting started...");
  for (let i = 0; i < assets.length; i++) {
    const receiverAddress = new PublicKey(assets[i].receiverAddress);

    const compressedNFTMetadata: MetadataArgs = {
      name: assets[i].name,
      symbol: "NB",
      uri: assets[i].uri,
      creators: [
        {
          address: payerKeypair.publicKey,
          verified: false,
          share: 100,
        },
      ],
      editionNonce: 0,
      uses: null,
      collection: {
        verified: false,
        key: collectionMint,
      },
      primarySaleHappened: false,
      sellerFeeBasisPoints: 100,
      isMutable: true,
      tokenProgramVersion: TokenProgramVersion.Original,
      tokenStandard: TokenStandard.NonFungible,
    };

    const createMintIxAccounts = {
      merkleTree: treeAddress,
      treeAuthority: treeAuthority,
      treeDelegate: payerKeypair.publicKey,
      collectionAuthority: payerKeypair.publicKey,
      collectionMint: collectionMint,
      collectionMetadata: collectionMetadata,
      editionAccount: collectionMasterEdition,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      payer: payerKeypair.publicKey,
      leafOwner: receiverAddress,
      leafDelegate: receiverAddress,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      bubblegumSigner: bubblegumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    };

    const createMintIxArgs = {
      metadataArgs: compressedNFTMetadata,
    };

    const mintIx = createMintToCollectionV1Instruction(
      createMintIxAccounts,
      createMintIxArgs
    );

    const Tx = new Transaction().add(mintIx);

    const signature = await sendAndConfirmTransaction(connection, Tx, [
      payerKeypair,
    ]);

    console.log(
      "Compressed NFT",
      i + 1,
      "/",
      assets.length,
      "successfuly minted!"
    );
    console.log("Transaction signature: ", signature, "\n");
  }
  console.log("Mint complete!");
}

mintCompressedNFT();
