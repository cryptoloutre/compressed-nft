import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { collectionCreators, collectionIsMutable, collectionName, collectionRoyalties, collectionSymbol, collectionURI, connection, privateKey } from "../config";
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { setComputeUnitLimit, setComputeUnitPrice } from "@metaplex-foundation/mpl-toolbox";

export async function createCollection() {

  const umi = createUmi(connection).use(mplTokenMetadata());
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(privateKey));
  const signer = createSignerFromKeypair(umi, keypair);
  umi.use(signerIdentity(signer));

  console.log("Initializing the collection mint...\n");
  const collectionMint = generateSigner(umi)
  const tx = await createNft(umi, {
    mint: collectionMint,
    name: collectionName,
    uri: collectionURI,
    symbol: collectionSymbol,
    sellerFeeBasisPoints: percentAmount(collectionRoyalties),
    creators: collectionCreators,
    isMutable: collectionIsMutable,
    isCollection: true,
  })
    .add(setComputeUnitLimit(umi, { units: 175000 }))
    .add(setComputeUnitPrice(umi, { microLamports: 300000 }))
    .sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });


  console.log("Successfuly initialized! Transaction signature: ", base58.deserialize(tx.signature)[0], "\n");
  return collectionMint.publicKey
}
