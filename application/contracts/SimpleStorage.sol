// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Simple storage contract.
 * Allows an owner to store and update a value.
 */

contract SimpleStorage {
    // State vars
    uint256 public storedValue;
    address public owner;

    // Events
    event ValueUpdated(uint256 newValue);

    // Errors
    error NotOwner();

    // Modifier
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        storedValue = 0;
    }

    // View fn
    function getValue() public view returns (uint256) {
        return storedValue;
    }

    // Setter fn
    function setValue(uint256 newValue) public onlyOwner {
        storedValue = newValue;
        emit ValueUpdated(newValue);
    }

    // Reset fn
    function resetValue() public onlyOwner {
        storedValue = 0;
        emit ValueUpdated(0);
    }

}
