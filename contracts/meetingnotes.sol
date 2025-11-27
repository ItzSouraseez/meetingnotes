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
