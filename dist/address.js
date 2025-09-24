"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payer = exports.MINT_ADDRESS = exports.PUBLIC_KEY = exports.PRIVATE_KEY = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
exports.PRIVATE_KEY = process.env.PRIVATE_KEY;
exports.PUBLIC_KEY = process.env.PUBLIC_KEY;
exports.MINT_ADDRESS = process.env.MINT_ADDRESS;
// Decode the Base58 private key string into a Uint8Array
const secretKey = bs58_1.default.decode(exports.PRIVATE_KEY);
exports.payer = web3_js_1.Keypair.fromSecretKey(secretKey);
