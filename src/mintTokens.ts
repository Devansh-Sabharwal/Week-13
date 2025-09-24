import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
const mint = new PublicKey(process.env.MINT_ADDRESS as string);
import { payer } from "./address";

export const mintTokens = async (reciever: string, amount: number) => {
  const owner = new PublicKey(reciever);
  const connection = new Connection("https://api.devnet.solana.com");
  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner,
    false,
    "confirmed",
    undefined,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  console.log("ata:", ata.address);
  const signature = await mintTo(
    connection,
    payer,
    mint,
    ata.address,
    payer.publicKey,
    amount,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log(signature);
};

export const burnTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  console.log("Burning tokens");
};

export const sendNativeTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  console.log("Sending native tokens");
};
