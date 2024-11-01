# Compressed NFTs

This repo contains scripts to create compressed NFTs. Compression is a new technology using Merkle tree wich allows to reduce network storage costs. In the case of NFTs, compression enables the mint of NFTs for a fraction of the cost as before. You can learn more about compression [here](https://spl.solana.com/account-compression) and [here](https://www.alchemy.com/overviews/compressed-nfts).
For an explanation of how scripts work, you can read this [medium article](https://medium.com/@laloutre/how-to-mint-compressed-nfts-dfcbee0ef51e)

## Getting Started

1. Clone the repo and install the dependencies.

```
git clone https://github.com/cryptoloutre/compressed-nft.git
cd compressed-nft
npm install
```

2. Open the `config.ts` file and modify it according to your needs. Basically, you will have to modify:
* the private key
* the endpoint
* the `maxDepth` parameter
* the `maxBufferSize` parameter
* the `canopyDepth` parameter
* the collection info

3. Open the `assets.json` file and modify it according to your needs. This file holds the `name`, the `uri` & the `receiverAddress` for each NFT you want to mint.
4. Run the following command to create your Merkle tree and your NFT collection

```
npx ts-node createTreeAndCollection.ts
```
5. Once the execution is finished, run the following command to mint your compressed NFTs

```
npx ts-node mintCompressedNFT.ts
```
