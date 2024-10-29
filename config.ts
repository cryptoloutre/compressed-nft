import { CreatorArgs } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { Connection } from "@solana/web3.js";

export const privateKey = [170, 253, 179, 56, 200, 101, 142, 90, 196, 51, 126, 187, 154, 219, 76, 204,
    211, 117, 129, 71, 5, 106, 16, 242, 178, 90, 10, 74, 44, 110, 121, 144, 9, 99,
    203, 120, 227, 221, 251, 160, 64, 114, 36, 140, 16, 53, 55, 8, 45, 183, 170,
    241, 163, 34, 151, 60, 92, 97, 1, 60, 54, 230, 217, 162];

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