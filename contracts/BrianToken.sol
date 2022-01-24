// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BrianCoin {
    address public owner;
    uint256 public totalSupply;
    mapping(address => bool) public the_boys;
    mapping(address => uint256) public balances;

    constructor() {
        the_boys[msg.sender] = true;
        owner = msg.sender;
    }

    function add_to_fam(address _boy) external {
        require(the_boys[msg.sender], "Only the boys can add to fam");
        the_boys[_boy] = true;
    }

    function remove_from_fam(address _bad_boy) external {
        require(msg.sender == owner, "Only the owner can remove a boy");
        the_boys[_bad_boy] = false;
    }

    function get_tokens(uint256 _amount) external payable {
        require(msg.value == _amount * 1e13, "Mismatching value and amount"); // 100000 BBC = 1 ether
        balances[msg.sender] += _amount;
        totalSupply += _amount;
        emit Transfer(address(this), msg.sender, _amount);
    }

    function withdraw_tokens(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Not Enough BrianCoin");
        balances[msg.sender] -= _amount;
        totalSupply -= _amount;
        payable(msg.sender).transfer(_amount * 1e13);
        emit Transfer(msg.sender, address(this), _amount);
    }

    function transfer_tokens(address to, uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Not Enough BrianCoin");
        balances[msg.sender] -= _amount;
        balances[to] += _amount;
        emit Transfer(msg.sender, to, _amount);
    }

    event Transfer(address from, address to, uint256 amount);
}
