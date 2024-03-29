// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "./Spawner.sol";

interface ISpawner {
    function safeMint(address _toAddress) external;
}