import { CreatorArgs } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { Connection } from "@solana/web3.js";

export const privateKey = [];

const endpoint = "https://api.devnet.solana.com";

export const connection = new Connection(endpoint);

/// Merkle Tree Config
export const maxDepth: number = 5;
export const maxBufferSize: number = 8;
export const canopyDepth: number = 2;

/// Collection Info
export const collectionName: string = 'Numbers collection';
export const collectionURI: string = 'https://arweave.net/SFBfNncAsdfMx5TExmrm26Xx4ciq7oWUL8mjXBnnFjw';
export const collectionSymbol: string = 'NB';
export const collectionCreators: Array<CreatorArgs> = [
    {
        address: publicKey('devqs7wyk1pXMP6ikntGQJSzmtkztcrUSXnFe4jwQAm'),
        verified: true,
        share: 100,
    },
];
export const collectionRoyalties: number = 5.5;
export const collectionIsMutable: boolean = false;