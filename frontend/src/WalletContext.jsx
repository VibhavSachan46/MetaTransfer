import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(localStorage.getItem('account') || ''); // Persisted account
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (account) {
      localStorage.setItem('account', account);
    } else {
      localStorage.removeItem('account');
    }
  }, [account]);

  return (
    <WalletContext.Provider value={{ account, setAccount, contract, setContract }}>
      {children}
    </WalletContext.Provider>
  );
};
