// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

contract BrianCoin is Standard_Token {
    address public owner;
    mapping(address => bool) public the_boys;

    constructor() Standard_Token(0, "BrianCoin", 2, "BBC") {
        the_boys[msg.sender] = true;
        owner = msg.sender;
    }

    function add_to_fam(address _boy) external {
        require(the_boys[msg.sender], "Only the boys can add to fam");
        the_boys[_boy] = true;
        emit NewMember(msg.sender, _boy);
    }

    function remove_from_fam(address _bad_boy) external {
        require(msg.sender == owner, "Only the owner can remove a boy");
        require(_bad_boy != owner, "Owner cannot remove himself");

        payable(_bad_boy).transfer(balances[_bad_boy] * 1e13);
        totalSupply -= balances[_bad_boy];
        balances[_bad_boy] = 0;
        the_boys[_bad_boy] = false;

        emit RemoveMember(_bad_boy);
    }

    function get_tokens(uint256 _amount) external payable {
        require(msg.value == _amount * 1e13, "Mismatching value and amount"); // 100000 BBC = 1 ether
        balances[msg.sender] += _amount;
        totalSupply += _amount;
        emit Token.Transfer(address(this), msg.sender, _amount);
    }

    function withdraw_tokens(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Not Enough BrianCoin");
        balances[msg.sender] -= _amount;
        totalSupply -= _amount;
        payable(msg.sender).transfer(_amount * 1e13);
        emit Token.Transfer(msg.sender, address(this), _amount);
    }

    event NewMember(address _approver, address _boy);
    event RemoveMember(address _bad_boy);
}
