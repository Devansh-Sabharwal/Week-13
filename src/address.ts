import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
export const PRIVATE_KEY = process.env.PRIVATE_KEY!;
export const PUBLIC_KEY = process.env.PUBLIC_KEY;
export const MINT_ADDRESS = process.env.MINT_ADDRESS;

// Decode the Base58 private key string into a Uint8Array
const secretKey = bs58.decode(PRIVATE_KEY);
export const payer = Keypair.fromSecretKey(secretKey);
