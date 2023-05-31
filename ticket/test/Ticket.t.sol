// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../lib/forge-std/src/Test.sol";
import "../src/Ticket.sol";

contract TicketTest is Test {
    Ticket public ticket;

    function setUp() public {
        ticket = new Ticket();
    }

    function testBuyTicket() public {
        uint256 ticketFee = 100;
        uint256 num = 2;
        uint256 totalPayment = ticketFee * num;

        // Call the buyTicket function with the required payment
        (bool success, ) = address(ticket).call{value: totalPayment}(abi.encodeWithSignature("buyTicket(uint256,uint256)", ticketFee, num));

        // Assert that the function call was successful
        assertTrue(success, "buyTicket should succeed");

        // Assert that the ticket deposit has been updated correctly
        assertEqual(ticket.deposit(), totalPayment, "Deposit should match total payment");
    }

    function testClaimPrize() public {
        address payable gamer = payable(address(0x123));
        uint256 prizeAmount = 200;

        // Call the claimPrize function as the contract owner
        (bool success, ) = address(ticket).call{value: prizeAmount}(abi.encodeWithSignature("claimPrize(address,uint256)", gamer, prizeAmount));

        // Assert that the function call was successful
        assertTrue(success, "claimPrize should succeed");

        // Assert that the prize has been claimed by the gamer
        emit Log("Assert gamer balance", address(gamer).balance);
        assertEqual(address(gamer).balance, prizeAmount, "Gamer balance should match prize amount");
    }

    function testIncreaseDeposit() public {
        uint256 amount = 500;

        // Call the increaseDeposit function with the required amount
        (bool success, ) = address(ticket).call{value: amount}(abi.encodeWithSignature("increaseDeposit()"));

        // Assert that the function call was successful
        assertTrue(success, "increaseDeposit should succeed");

        // Assert that the ticket deposit has been increased correctly
        assertEqual(ticket.deposit(), amount, "Deposit should match amount");
    }

    function testWithdrawDeposit() public {
        uint256 amount = 300;

        // Call the withdrawDeposit function as the contract owner
        (bool success, ) = address(ticket).call(abi.encodeWithSignature("withdrawDeposit(uint256)", amount));

        // Assert that the function call was successful
        assertTrue(success, "withdrawDeposit should succeed");

        // Assert that the ticket deposit has been reduced correctly
        assertEqual(ticket.deposit(), 200, "Deposit should match remaining amount");
    }
}
