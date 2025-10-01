import React, { useState } from "react";
import { ethers } from "ethers";

export default function ConnectWalletButton({ onConnect }) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const connect = async () => {
    setError("");
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAddress(accounts[0]);
        if (onConnect) onConnect(accounts[0]);
      } catch (err) {
        setError("User denied wallet connection");
      }
    } else {
      setError("MetaMask not found. Please install MetaMask.");
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={connect}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        {address
          ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
          : "Connect Wallet"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}