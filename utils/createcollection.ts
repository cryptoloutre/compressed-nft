import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAccount,
  createMint,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  CreateMetadataAccountArgsV3,
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

export async function createCollection(
  connection: Connection,
  payer: Keypair,
  collectionMetadata: CreateMetadataAccountArgsV3
) {
  console.log("Initializing the collection mint...\n");
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    payer.publicKey,
    0,
    undefined,
    { commitment: "finalized" },
    TOKEN_PROGRAM_ID
  );

  console.log("Mint initialized! Mint address: ", mint.toBase58(), "\n");

  console.log("Initializing token account...\n");
  const tokenAccount = await createAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    undefined,
    { commitment: "finalized" }
  );
  console.log("Token account initialized! Token account address: ", tokenAccount.toBase58(), "\n");


  console.log("Minting token...\n");
  const mintSignature = await mintTo(
    connection,
    payer,
    mint,
    tokenAccount,
    payer,
    1,
    [],
    { commitment: "finalized" }
  );
  console.log("Token minted! Mint signature: ", mintSignature, "\n");

  const [metadataAccount, _bump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const createMetadataIxAccounts = {
    metadata: metadataAccount,
    mint: mint,
    mintAuthority: payer.publicKey,
    payer: payer.publicKey,
    updateAuthority: payer.publicKey,
  };

  const createMetadataIxArgs = {
    createMetadataAccountArgsV3: collectionMetadata,
  };

  const createMetadataIx = createCreateMetadataAccountV3Instruction(
    createMetadataIxAccounts,
    createMetadataIxArgs
  );

  const [masterEditionAccount, _bump2] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const createMasterIxAccounts = {
    edition: masterEditionAccount,
    mint: mint,
    mintAuthority: payer.publicKey,
    payer: payer.publicKey,
    updateAuthority: payer.publicKey,
    metadata: metadataAccount,
  };

  const createMasterEditionIx = createCreateMasterEditionV3Instruction(
    createMasterIxAccounts,
    {
      createMasterEditionArgs: {
        maxSupply: 0,
      },
    }
  );

  console.log("Initializing metadata and master edition account...\n");
  const Tx = new Transaction().add(createMetadataIx).add(createMasterEditionIx);

  const signature = await sendAndConfirmTransaction(connection, Tx, [
    payer,
  ]);
  
  console.log("Successfuly initialized! Transaction signature: ", signature, "\n");
  return {
    mint: mint.toBase58(),
    metadata: metadataAccount.toBase58(),
    masterEdition: masterEditionAccount.toBase58(),
  }
}
