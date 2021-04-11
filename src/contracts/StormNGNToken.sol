pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//A Token that is Peng to the naira
contract StormNGNToken is ERC20{

	constructor() public ERC20("Storm Naira Token","STNGR"){
		_mint(msg.sender, 1000000000000000000000000); //creating a million storms
	}

}