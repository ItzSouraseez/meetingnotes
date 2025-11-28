# 📝 Meeting Notes dApp

## 📌 Project Description
The **Meeting Notes dApp** is a simple, beginner-friendly decentralized application that allows users to store meeting notes directly on the blockchain. Each note is saved permanently, publicly, and transparently — making it ideal for teams, DAOs, classrooms, and projects that require immutable, timestamped records.

This project is designed for developers new to Web3 who want to learn how to integrate a smart contract with a modern frontend using Wagmi + Viem.

---

## 🚀 What It Does
- Lets users connect their crypto wallet.
- Allows anyone to **add a meeting note**.
- Stores each note **permanently on-chain** with:
  - Author address  
  - Note content  
  - Timestamp (block time)
- Lets users **view all notes**, fully retrieved from the blockchain.
- Provides a clean frontend UI for interacting with the smart contract.

---

## ⭐ Features
### 🔒 Fully Decentralized Notes  
Your meeting notes are stored on-chain—no databases, no servers, no centralized control.

### 👤 Automatic Author Attribution  
Each note includes the wallet address that created it.

### ⏱ Timestamped  
Blockchain timestamps ensure that all notes are immutably linked to the moment they were recorded.

### 💻 Easy-to-Use UI  
Beginner-friendly interface built with:
- React  
- Wagmi  
- Viem  
- TailwindCSS  

### 🛠 Simple and Clean Smart Contract  
Built intentionally small for easy learning.  
Just three functions:
- `addNote()`
- `getNote()`
- `getNotesCount()`

---

## ☎️ Contract Address: 
From: 0x36cEc8E14026cCA3f8Fc885268dBa6bD16309DAd
To: 0xCbf39C26feFdE81CEcA19300ACC32731E66CAAc5

## 🔗 Explorer Address: (https://coston2-explorer.flare.network//tx/0xe6adf7b9cf33d48c2699f755419ea91d5c55b46c4a1d1f06ca3038e82b23e2bd)
<img width="1800" height="1169" alt="Screenshot 2025-11-28 at 1 58 37 PM" src="https://github.com/user-attachments/assets/52fa13c1-7f7a-4aa2-8835-b6d404d8325b" />


---

## 📦 Source Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MeetingNotes {

    // A struct to store each note
    struct Note {
        address author;
        string content;
        uint256 timestamp;
    }

    // Array to store all meeting notes
    Note[] private notes;

    // Add a new meeting note
    function addNote(string calldata _content) external {
        notes.push(
            Note({
                author: msg.sender,
                content: _content,
                timestamp: block.timestamp
            })
        );
    }

    // Get the total number of notes
    function getNotesCount() external view returns (uint256) {
        return notes.length;
    }

    // Get a specific note by index
    function getNote(uint256 _index)
        external
        view
        returns (
            address author,
            string memory content,
            uint256 timestamp
        )
    {
        require(_index < notes.length, "Note does not exist");
        Note storage n = notes[_index];
        return (n.author, n.content, n.timestamp);
    }
}
```
