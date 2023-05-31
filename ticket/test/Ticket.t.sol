// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../lib/forge-std/src/Test.sol";
import "../src/Ticket.sol";


contract TicketTest is Test {
    Ticket public ticket;
    function setUp() public {
        ticket = new Ticket();
    }

    function testdeposit() public {
        asserEq();
    }

    function testwitdraw() public {
         asserEq();
    }

  }