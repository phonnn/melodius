// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./ISpawner.sol";
import "./console.sol";

contract Presale is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct PreSaleEvent {
        uint256 start;
        uint256 end;
    }

    event SetSaleEvent(uint256 _round, uint256 _start, uint256 _end, uint256 _price);
    event BuyNFT(address _user, uint256 _round);

    ISpawner public spawner;
   
    mapping(uint256 => PreSaleEvent) private presaleEvent;
    mapping(uint256 => EnumerableSet.AddressSet) private presaleList;

    constructor(address _spawner){
        spawner = ISpawner(_spawner);
    }

    modifier onlyWhiteList(uint256 _round) {
        require(presaleList[_round].contains(_msgSender()), "Not Whitelist");
        _;
    }

    function setPresaleList(uint256 _round, address[] memory _listAddress) external onlyOwner {
        for(uint i = 0; i < _listAddress.length; i++){
            presaleList[_round].add(_listAddress[i]);
        }
    }

    function getPresaleList(uint256 _round, address _user) public view returns (bool){
        return presaleList[_round].contains(_user);
    }

    function setSaleEvent(uint256 _round, uint256 _start, uint256 _end, uint256 _price) external onlyOwner {
        presaleEvent[_round] = PreSaleEvent(_start, _end);
        spawner.setPrice(_round, _price);
        emit SetSaleEvent(_round, _start, _end, _price);
    }

    function getSaleEvent(uint256 _round) public view returns (PreSaleEvent memory){
        return presaleEvent[_round];
    }

    function buy(uint256 _round) external onlyWhiteList(_round) {
        require(block.timestamp >= presaleEvent[_round].start, "Presale not started yet");
        require(block.timestamp <= presaleEvent[_round].end, "Presale ended");

        // mint nft token
        spawner.safeMint(_msgSender(), _round, 1);

        // remove address from presaleList
        presaleList[_round].remove(_msgSender());
        emit BuyNFT(_msgSender(), _round);
    }
}