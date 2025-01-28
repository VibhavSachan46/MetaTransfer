import React, { useState } from 'react';
import { useWallet } from '../WalletContext';
import { ethers } from 'ethers';
import toast from "react-hot-toast";
const Send = () => {

  const { account, contract } = useWallet();

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (address == '' || amount == '' || message == '') {
      if (!contract) {
        throw new Error('Smart contract not loaded');
      }
      console.log("account is ", account);
      console.log("con is ", contract);

      toast.error('fill all details');
      return
    }
    else {
      console.log('Sending Crypto:', address, amount, message);

      const parsedAmount = ethers.utils.parseEther(amount)
      const toastId = toast.loading("Preparing to send funds, please wait...");

      try {
        if (!contract) {
          toast.error('Smart contract not loaded');
        }


        const tx = await contract.transfer(address, message, { value: parsedAmount })

        await tx.wait();

        toast.dismiss(toastId);
        toast.success('Transaction sent successfully')
        setAddress('')
        setAmount('')
        setMessage('')

      }
      catch (error) {
        toast.dismiss(toastId);
        console.error('Error sending transaction:', error);
        toast.error('Transaction failed. Check the console for details.');
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-blue-500">Send Crypto Across the World</h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Transfer Details</h2>

        {/* Address Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Recipient Address</label>
          <input
            type="text"
            placeholder="Enter wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount (ETH)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Message (Optional)</label>
          <textarea
            placeholder="Add a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            rows="3"
          ></textarea>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 cursor-pointer"
        >
          Send now
        </button>
      </div>
    </div>
  );
};

export default Send;
