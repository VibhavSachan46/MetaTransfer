// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Transaction {

    uint public transactionCounter;

    // Struct to store transaction details
    struct TransactionStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint timeStamp;
    }

    // Array to store all transactions
    TransactionStruct[] private transactions;

    // Event to emit transaction details
    event Transfer(
        address indexed sender,
        address indexed receiver,
        uint amount,
        string message,
        uint timeStamp
    );

    // Function to transfer crypto
    function transfer(address payable _receiver, string memory _message) public payable {
        require(msg.value > 0, "Transfer amount must be greater than zero.");
        require(_receiver != address(0), "Receiver cannot be the zero address.");

        // Log the transaction
        transactions.push(TransactionStruct({
            sender: msg.sender,
            receiver: _receiver,
            amount: msg.value,
            message: _message,
            timeStamp: block.timestamp
        }));

        // Increment transaction counter
        transactionCounter += 1;

        // Emit the transfer event
        emit Transfer(msg.sender, _receiver, msg.value, _message, block.timestamp);

        // Transfer the amount
        _receiver.transfer(msg.value);
    }

    // Function to get all transactions
    function getAllTransactions() public view returns (TransactionStruct[] memory) {
        return transactions;
    }

    // Function to get transaction count (already implemented)
    function getTransactionCount() public view returns (uint) {
        return transactionCounter;
    }
}
