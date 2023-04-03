# Compressed NFTs


## Getting Started

1. Clone the repo and install the dependencies.

```
git clone https://github.com/cryptoloutre/compressed-nft.git
cd compressed-nft
npm install
```

2. Open the `createTreeAndCollection.ts` file and modify it according to your needs. Basically, you will have to modify:
* the private key
* the `maxDepthSizePair` parameter
* the `canopyDepth` parameter
* the `collectionMetadata` parameter with your own collection metadata (`name`, `uri`, `symbol`, `creators`, `sellerFeeBasisPoints` & `isMutable`)

3. Open the `mintCompressedNFT.ts` file and modify it according to your needs. Basically, you will have to modify:
* the private key
* the `compressedNFTMetadata` parameter with your own NFT metadata (`symbol`, `creators`, `sellerFeeBasisPoints` & `isMutable`)

4. Open the `assets.json` file and modify it according to your needs. This file holds the `name`, the `uri` & the `receiverAddress` for each NFT you want to mint.
5. Run the following command to create your Merkle tree and your NFT collection

```
npx ts.node createTreeAndCollection.ts
```
6. Once the execution is finished, run the following command to mint your compressed NFTs

```
npx ts.node mintCompressedNFT.ts
```
