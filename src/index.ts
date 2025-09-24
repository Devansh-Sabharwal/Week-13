import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { burnTokens, mintTokens, sendNativeTokens } from "./mintTokens";

const app = express();
app.use(express.json());

app.post("/helius", async (req, res) => {
  const fromAddress = req.body.fromAddress;
  const toAddress = req.body.toAddress;
  const amount = req.body.amount;
  const type = "received_native_sol";

  if (type === "received_native_sol") {
    await mintTokens(fromAddress, amount);
  } else {
    // What could go wrong here?
    await burnTokens(fromAddress, toAddress, amount);
    await sendNativeTokens(fromAddress, toAddress, amount);
  }

  res.send("Transaction successful");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
