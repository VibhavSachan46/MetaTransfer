import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Send from './components/Send';
import View from './components/View';
import { WalletProvider } from './WalletContext';

const App = () => {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<Send />} />
          <Route path="/view" element={<View />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
};

export default App;
