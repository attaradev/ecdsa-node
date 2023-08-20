import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";
import server from "./server";
import { createWallet } from "./utils";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  useEffect(() => { 
    const wallet = JSON.parse(localStorage.getItem("wallet"));
    if (wallet) {
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      setPublicKey(wallet.publicKey);
    } else {
      const newWallet = createWallet();
      setAddress(newWallet.address);
      setPrivateKey(newWallet.privateKey);
      setPublicKey(newWallet.publicKey);
      localStorage.setItem("wallet", JSON.stringify(newWallet));
    }

  }, []);

  useEffect(() => { 
    const getBalance = async () => {
      const {data} = await server.get(`balance/${address}`);
      setBalance(data.balance);
    };
    getBalance();
  }, [address]);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        publicKey={publicKey}
        privateKey={privateKey}
      />
    </div>
  );
}

export default App;
