const express = require("express");
const app = express();
const cors = require("cors");
const { validateTx } = require("./utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
  "0x748e810d090a036a": 10000,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, publicKey, ...tx } = req.body;

  const { valid, address } = validateTx(tx, signature, publicKey);

  setInitialBalance(tx.sender);
  setInitialBalance(tx.recipient);

  if (!valid || address !== tx.sender) {
    res.status(400).send({ message: "Invalid signature!" });
  } else if (balances[tx.sender] < tx.amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[tx.sender] -= tx.amount;
    balances[tx.recipient] += tx.amount;
    res.send({ balance: balances[tx.sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
