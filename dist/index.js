"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mintTokens_1 = require("./mintTokens");
const web3_js_1 = require("@solana/web3.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/helius", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount;
    const type = req.body.type || "received_DCOIN";
    if (type === "received_native_sol") {
        yield (0, mintTokens_1.mintTokens)(fromAddress, amount * web3_js_1.LAMPORTS_PER_SOL);
    }
    else {
        // What could go wrong here?
        yield (0, mintTokens_1.burnTokens)(fromAddress, amount * web3_js_1.LAMPORTS_PER_SOL);
        // await sendNativeTokens(fromAddress, toAddress, amount);
    }
    res.send("Transaction successful");
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
