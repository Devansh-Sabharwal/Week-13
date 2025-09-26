import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  burnChecked,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
const mint = new PublicKey(process.env.MINT_ADDRESS as string);
import { payer, PUBLIC_KEY } from "./address";

export const mintTokens = async (reciever: string, amount: number) => {
  try {
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
  } catch (e) {
    console.log(e);
  }
};

export const burnTokens = async (amount: number) => {
  console.log("Burning tokens");
  try {
    const owner = new PublicKey(PUBLIC_KEY!);

    const connection = new Connection("https://api.devnet.solana.com");
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      false,
      "confirmed",
      undefined,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    console.log("ata", ata.address);

    console.log("burning......");
    const burnSignature = await burnChecked(
      connection, // connection
      payer, // payer
      ata.address, // token account
      mint, // mint
      owner, // owner of token account
      amount, // amount
      9, // decimals
      [], // additional signers
      {
        commitment: "confirmed", // confirmation options
      },
      TOKEN_2022_PROGRAM_ID
    );
    console.log(burnSignature);
    const tokenAccountAfter = await getAccount(
      connection,
      ata.address,
      "confirmed",
      TOKEN_2022_PROGRAM_ID
    );
    console.log(
      "Token balance after burn:",
      Number(tokenAccountAfter.amount) / 1_000_000_000,
      "tokens"
    );
  } catch (e) {
    console.log(e);
  }
};

export const sendNativeTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  console.log("Sending native tokens");
};
