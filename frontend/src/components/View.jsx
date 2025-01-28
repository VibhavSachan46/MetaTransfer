import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'; // Import ethers.js for conversion
import { useWallet } from '../WalletContext';

const View = () => {
  const { account, contract } = useWallet();

  const [allTransactions, setAllTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        if (!contract) {
          throw new Error('Smart contract not loaded');
        }

        const getAllTransactions = await contract.getAllTransactions();
        const getTransactionCount = await contract.getTransactionCount();

        console.log("all txn", Number(getAllTransactions[0].timestamp));


        const TransactionCountinDecimal = Number(getTransactionCount);
        setTransactionCount(TransactionCountinDecimal);

        const formattedTransactions = getAllTransactions.map((txn, index) => {
          const transactionDate = new Date(txn.timeStamp *1000).toLocaleString() // Convert UNIX 
          // timestamp to JavaScript Date

          // console.log("date is", transactionDate);

          return {
            id: index,
            sender: txn[0],
            receiver: txn[1],
            amount: ethers.utils.formatEther(txn.amount), // Convert Wei to Ether
            message: txn.message,
            date: transactionDate, // Format date for readability
          };
        });

        // Reverse the order of transactions for latest-first
        setAllTransactions(formattedTransactions.reverse());
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    getData();
  }, [contract]);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-200 p-8 flex items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-300">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-200 p-8 flex items-center justify-center">
        <h2 className="text-2xl font-semibold text-red-500">Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      {/* Page Header */}
      <h1 className="text-4xl text-gray-300 mb-8 text-center font-bold">
        All Transactions: {transactionCount}
      </h1>

      {/* Transactions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTransactions.map((transact) => (
          <div
            key={transact.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <p>
                <span className="font-semibold">From:</span> {transact.sender}
              </p>
              <p>
                <span className="font-semibold">To:</span> {transact.receiver}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> {transact.amount} ETH
              </p>
              <p>
                <span className="font-semibold">Message:</span>{' '}
                {transact.message || 'No message'}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {transact.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default View;
