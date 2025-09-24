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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNativeTokens = exports.burnTokens = exports.mintTokens = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const mint = new web3_js_1.PublicKey(process.env.MINT_ADDRESS);
const address_1 = require("./address");
const mintTokens = (reciever, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = new web3_js_1.PublicKey(reciever);
    const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
    const ata = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, address_1.payer, mint, owner, false, "confirmed", undefined, spl_token_1.TOKEN_2022_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
    console.log("ata:", ata.address);
    const signature = yield (0, spl_token_1.mintTo)(connection, address_1.payer, mint, ata.address, address_1.payer.publicKey, amount, undefined, undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
    console.log(signature);
});
exports.mintTokens = mintTokens;
const burnTokens = (fromAddress, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Burning tokens");
});
exports.burnTokens = burnTokens;
const sendNativeTokens = (fromAddress, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Sending native tokens");
});
exports.sendNativeTokens = sendNativeTokens;
