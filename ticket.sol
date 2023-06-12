// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Ticket {
    address public owner;
    uint256 public deposit;

    event TicketBought(address indexed buyer, uint256 amount);
    event PrizeClaimed(address indexed gamer, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    function buyTicket(uint256 ticketFee, uint256 num) external payable returns (bool) {
        uint256 totalPayment = ticketFee * num;
        require(msg.value >= totalPayment, "Insufficient payment");

        deposit += totalPayment;

        emit TicketBought(msg.sender, totalPayment);
        return true;
    }

    function claimPrize(address payable gamer, uint256 amount) public onlyOwner returns (bool) {
        require(address(this).balance >= amount, "Insufficient funds in the contract");
        gamer.transfer(amount);

        emit PrizeClaimed(gamer, amount);
        
        return true;
    }

    function increaseDeposit() external payable {
        require(msg.value > 0, "Deposit value must be greater than 0");
        deposit += msg.value;
    }

    function withdrawDeposit(uint256 amount) external onlyOwner {
        require(amount <= deposit, "Amount exceeds available deposit");
        deposit -= amount;
        payable(owner).transfer(amount);
    }
}