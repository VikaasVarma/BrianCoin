// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BrianCoin {
    address public owner;
    mapping(address => bool) public the_boys;
    mapping(address => uint256) public balances;

    event Member(address _member);

    constructor() {
        the_boys[msg.sender] = true;
        owner = msg.sender;
    }

    function add_to_fam(address _boy) external {
        require(the_boys[msg.sender]);
        the_boys[_boy] = true;
        emit Member(_boy);
    }

    function remove_from_fam(address _bad_boy) external {
        require(msg.sender == owner);
        the_boys[_bad_boy] = false;
    }

    function get_tokens(uint256 _amount) external payable {
        require(msg.value == _amount * 1e13);
        balances[msg.sender] += _amount;
    }

    function withdraw_tokens(uint256 _amount) external {
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount * 1e13);
    }

    function transfer_tokens(address to, uint256 _amount) external {
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount;
        balances[to] += _amount;
    }
}
