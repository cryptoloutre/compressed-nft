import { createTree, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { createSignerFromKeypair, generateSigner, signerIdentity } from "@metaplex-foundation/umi";
import { canopyDepth, connection, maxBufferSize, maxDepth, privateKey } from "../config";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { setComputeUnitLimit, setComputeUnitPrice } from "@metaplex-foundation/mpl-toolbox";

export async function createMerkleTree() {

  const umi = createUmi(connection).use(mplBubblegum());
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(privateKey));
  const signer = createSignerFromKeypair(umi, keypair);
  umi.use(signerIdentity(signer));

  console.log("Creating the Merkle tree...\n")
  const merkleTree = generateSigner(umi);
  const tx = await (await createTree(umi, {
    merkleTree,
    maxDepth: maxDepth,
    maxBufferSize: maxBufferSize,
    canopyDepth: canopyDepth
  }))
    .add(setComputeUnitLimit(umi, { units: 45000 }))
    .add(setComputeUnitPrice(umi, { microLamports: 300000 }))
    .sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

  console.log("Tree successfuly created!");
  console.log("Transaction signature: ", base58.deserialize(tx.signature)[0], "\n");
  return merkleTree.publicKey
}
