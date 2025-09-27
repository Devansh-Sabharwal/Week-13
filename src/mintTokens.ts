import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  burnChecked,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
const mint = new PublicKey(process.env.MINT_ADDRESS as string);
let initialSOL = parseInt(process.env.INITIAL_SUPPLY!);
let initialDCOIN = 1000;
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
    const price = calcPrice();
    const tokenAmount = amount / price;
    const signature = await mintTo(
      connection,
      payer,
      mint,
      ata.address,
      payer.publicKey,
      tokenAmount * LAMPORTS_PER_SOL,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    initialSOL += amount / LAMPORTS_PER_SOL;
    initialDCOIN += tokenAmount;
    console.log(signature);
  } catch (e) {
    console.log(e);
  }
};

export const burnTokens = async (reciever: string, amount: number) => {
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
      connection,
      payer,
      ata.address,
      mint,
      owner,
      amount,
      9,
      [],
      {
        commitment: "confirmed",
      },
      TOKEN_2022_PROGRAM_ID
    );
    const price = calcPrice();
    await sendNativeTokens(reciever, amount * price);

    initialDCOIN -= amount;
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

export const sendNativeTokens = async (reciever: string, amount: number) => {
  console.log("Sending native tokens");
  const connection = new Connection("https://api.devnet.solana.com");
  try {
    const recipientPubkey = new PublicKey(reciever);

    // convert to lamports
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

    // Build transfer instruction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipientPubkey,
        lamports,
      })
    );

    // Send and confirm
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer],
      { commitment: "confirmed" }
    );

    console.log(
      `✅ Sent ${amount} SOL to ${reciever}. Signature: ${signature}`
    );
    return signature;
  } catch (e) {
    console.error("❌ Error sending SOL:", e);
    throw e;
  }
};
function calcPrice() {
  const monthlyRate = 0.04; // 4% per month

  // Starting date (24 September 2025)
  const startDate = new Date(2025, 8, 24);
  const now = new Date();

  // Difference in days
  const msPerMonth = 1000 * 60 * 60 * 24 * 30;
  const diffDays = (now.getTime() - startDate.getTime()) / msPerMonth;

  if (diffDays < 0) {
    throw new Error("Start date is in the future!");
  }

  const interest = initialSOL * monthlyRate * diffDays;
  const total = initialSOL + interest;

  return total / initialDCOIN;
}
