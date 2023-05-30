// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Ticket {

    address public owner;
    uint public deposit;     // show deposit


    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    function buyTicket(uint256 ticketFee, uint num) external payable returns (bool){
        require(msg.value > ticketFee * num, "Insufficient payment");
        deposit = msg.value;
        return true;  // If ture --> ticket += num in DB
    }


    function claimPrize(address gamer, uint256 amount) public payable onlyOwner returns (bool) {
        require(address(this).balance >= amount, "Insufficient funds in the contract");
        payable(gamer).transfer(amount);
        return true;
    }


    // deposit 늘리기
    // deposit 빼기

}
