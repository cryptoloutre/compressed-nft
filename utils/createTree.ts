import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  createCreateTreeInstruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  createAllocTreeIx,
  ValidDepthSizePair,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";

export async function createTree(
  connection: Connection,
  payer: Keypair,
  maxDepthSizePair: ValidDepthSizePair,
  canopyDepth: number,
) {

  console.log("Creating the Merkle tree...\n")
  const merkleTreeKeypair = Keypair.generate();

  const allocTreeIx = await createAllocTreeIx(
    connection,
    merkleTreeKeypair.publicKey,
    payer.publicKey,
    maxDepthSizePair,
    canopyDepth
  );

  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(merkleTreeKeypair.publicKey.toBytes())],
    BUBBLEGUM_PROGRAM_ID
  );

  const createTreeIxAccounts = {
    treeAuthority: treeAuthority,
    merkleTree: merkleTreeKeypair.publicKey,
    payer: payer.publicKey,
    treeCreator: payer.publicKey,
    logWrapper: SPL_NOOP_PROGRAM_ID,
    compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  };

  const createTreeIxArgs = {
    maxDepth: maxDepthSizePair.maxDepth,
    maxBufferSize: maxDepthSizePair.maxBufferSize,
    public: false,
  };

  const createTreeIx = createCreateTreeInstruction(
    createTreeIxAccounts,
    createTreeIxArgs
  );

  const Tx = new Transaction().add(allocTreeIx).add(createTreeIx);

  const signature = await sendAndConfirmTransaction(connection, Tx, [
    payer,
    merkleTreeKeypair,
  ]);
  console.log("Tree successfuly created!");
  console.log("Transaction signature: ", signature, "\n");


  return merkleTreeKeypair.publicKey.toBase58()
}
