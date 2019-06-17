pragma solidity >=0.4.24;

interface IAdapter {
  // returns the value of 1 token1 in units of token2
  function ping(address token1, address token2) public returns (uint256);
}
