// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFTSpawner is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    event Mint(address user, uint256 tokenID);
        
    Counters.Counter private _tokenIdCounter;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        _tokenIdCounter.increment();
    }

    function safeMint(address _toAddress) onlyOwner external {
        require(_toAddress != address(0), "Zero address");

        uint256 tokenID = _tokenIdCounter.current();
        _safeMint(_toAddress, tokenID);
        _tokenIdCounter.increment();

        emit Mint(_toAddress, tokenID);
    }
}