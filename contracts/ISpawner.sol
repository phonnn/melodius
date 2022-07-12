// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "./Spawner.sol";


interface ISpawner {
    function setPrice(uint256 _round, uint256 _price) external;
    function safeMint(address _toAddress, uint256 _round, uint256 _quantity) external; 
}