const {
  utf8ToBytes,
  hexToBytes,
  toHex,
} = require("ethereum-cryptography/utils");
const { secp256k1: secp } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

function hashTx(tx) {
  const encoded = utf8ToBytes(JSON.stringify(tx));
  const hashed = keccak256(encoded);
  return toHex(hashed);
}

function getAddress(publicKey) {
  const hashed = keccak256(hexToBytes(publicKey).slice(1)).slice(-20);
  return `0x${toHex(hashed.slice(12))}`;
}

function validateTx(tx, signature, publicKey) {
  const valid = secp.verify(signature, hashTx(tx), publicKey);
  const address = getAddress(publicKey);
  return { valid, address };
}

module.exports = {
  validateTx,
};
