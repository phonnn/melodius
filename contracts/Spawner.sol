// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract NFTSpawner is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;

    event Mint(address user, uint256 round, uint256 amount);
    event SetMinter(address minter);
    event SetPrice(uint256 round, uint256 price);
        
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => uint256) public prices;
    uint256 public remainsToken = 10000;
    address public minter;
    IERC20 public paymentToken;

    constructor(
        string memory _name,
        string memory _symbol,
        address _paymentToken
    ) ERC721(_name, _symbol) {
        paymentToken = IERC20(_paymentToken);
        _tokenIdCounter.increment();
    }

    modifier onlyMinter() {
        require(minter == _msgSender(), "Only minter can do this");
        _;
    }

    function setPrice(uint256 _round, uint256 _price) onlyMinter external {
        prices[_round] = _price * 1e18;
        emit SetPrice(_round, _price);
    }

    function setMinter(address _account) onlyOwner external {
        require(_account != address(0), "Zero address");
        minter = _account;
        emit SetMinter(_account);
    }

    function safeMint(address _toAddress, uint256 _round, uint256 _amount) onlyMinter external {
        require(_toAddress != address(0), "Zero address");
        require(_amount > 0, "quantity must be greater than 0");
        require(remainsToken >= _amount, "out of token");

        // check approve
        uint256 payAmount = prices[_round] * _amount;
        require(payAmount > 0, "round not set");

        uint256 approveAmount = paymentToken.allowance(_toAddress, address(this));
        require(approveAmount >= payAmount, "allowance is not enough");

        uint256 tokenBalance = paymentToken.balanceOf(_toAddress);
        require(tokenBalance >= payAmount, "token balance is not enough");

        // get payments
        paymentToken.transferFrom(_toAddress, minter, payAmount);

        for (uint256 i = 0; i < _amount; i++) {
            _safeMint(_toAddress, _tokenIdCounter.current());
            _tokenIdCounter.increment();
            remainsToken--;
        }
        emit Mint(_toAddress, _round, _amount);
    }
}