import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { useState } from 'react';
import Transaction from "../artifacts/contracts/Transaction.sol/Transaction.json"
import { useNavigate } from "react-router-dom";
import { useWallet } from '../WalletContext';
import toast from 'react-hot-toast';

const Home = () => {
  const { account, setAccount, contract, setContract } = useWallet();

  const navigate = useNavigate();

  const [accountBalance, setAccountBalance] = useState(0);

  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(providerInstance);

        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const signer = providerInstance.getSigner();
        const address = await signer.getAddress();

        setAccount(address);

        const contractAddress = "0xd913CDd430C5624d094606C9c02137122eB92338";
        const contractInstance = new ethers.Contract(contractAddress, Transaction.abi, signer);

        setContract(contractInstance);

        const balanceInWei = await providerInstance.getBalance(address); // Get balance in Wei
        const balanceInEther = ethers.utils.formatEther(balanceInWei); // Convert to Ether
        setAccountBalance(balanceInEther);

        // Log connected account
        console.log("Connected account:", address);
        console.log("Balance is:", balanceInEther);

        // Handle account or chain changes
        window.ethereum.on("accountsChanged", () =>
          window.location.reload()
        );
        window.ethereum.on("chainChanged", () =>
          window.location.reload()
        );

        toast.success("Wallet connected successfully")
      } catch (error) {
        console.error("Connection error:", error);
        toast.error("Failed to connect wallet. Please try again.");
      }
    } else {
      toast.error("MetaMask not installed. Please install it to connect your wallet.");
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setContract(null);
    setProvider(null);
    localStorage.removeItem('account');
    toast.success("Wallet disconnected.");
  };

  useEffect(() => {
    const restoreConnection = async () => {
      const savedAccount = localStorage.getItem('account');
      if (savedAccount && window.ethereum) {
        const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(providerInstance);

        const signer = providerInstance.getSigner();
        const contractAddress = "0xd913CDd430C5624d094606C9c02137122eB92338";
        const contractInstance = new ethers.Contract(contractAddress, Transaction.abi, signer);

        setAccount(savedAccount);
        setContract(contractInstance);

        const balanceInWei = await providerInstance.getBalance(savedAccount);
        const balanceInEther = ethers.utils.formatEther(balanceInWei);
        setAccountBalance(balanceInEther);

        console.log("Restored wallet connection:", savedAccount);
      }
    };

    restoreConnection();
  }, []);

  const navigateToSendPage = () => {
    navigate('/send'); // Navigate to the Send page
  };

  const navigateToviewPage = () => {
    navigate('/view');
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-gray-200">
      <div className="max-w-4xl text-center px-6 flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-500 mb-6">
          Welcome to Meta Transfer
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Seamlessly transfer cryptocurrency to anyone, anywhere in the world. Fast, secure, and reliable.
        </p>
        {account ? (
          <div>
            <div className="bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className='flex flex-col items-start gap-y-4'>
                <p>Account: {account}</p>
                <p>Balance: <span>{accountBalance}</span> ETH</p>
              </div>
              <button className="mt-4 py-2 px-2 bg-red-500 hover:bg-red-600 text-white font-medium text-md rounded-lg shadow-lg transition-all duration-300 cursor-pointer" onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
            </div>

            <div className='flex gap-4 justify-center items-center m-4'>
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 cursor-pointer"
                onClick={navigateToSendPage}>
                Send fund
              </button>
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 cursor-pointer"
                onClick={navigateToviewPage}>
                View All Transactions
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium text-lg rounded-lg shadow-lg transition-all duration-300 cursor-pointer" onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>

        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Fast Transfers</h3>
          <p className="text-gray-300">
            Experience lightning-fast crypto transactions with minimal fees and maximum efficiency.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Secure Transactions</h3>
          <p className="text-gray-300">
            Your funds are safe with us. We use blockchain technology to ensure secure transfers.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">User Friendly</h3>
          <p className="text-gray-300">
            Our platform is designed for everyone, whether you're a beginner or a crypto expert.
          </p>
        </div>
      </div>


    </div>
  );
};

export default Home;
