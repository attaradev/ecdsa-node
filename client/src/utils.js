import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";

export function createWallet() {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  const address = getAddress(publicKey);
  return {
    address,
    privateKey: toHex(privateKey),
    publicKey: toHex(publicKey),
  };
}

export function signTx(tx, privateKey) {
  const hashed = hashTx(tx);
  const signature = secp.sign(hashed, privateKey);
  return signature.toCompactHex();
}

function getAddress(publicKey) {
  const hashed = keccak256(publicKey.slice(1)).slice(-20);
  return `0x${toHex(hashed.slice(12))}`;
}

function hashTx(tx) {
  const encoded = utf8ToBytes(JSON.stringify(tx));
  const hashed = keccak256(encoded);
  return toHex(hashed);
}
