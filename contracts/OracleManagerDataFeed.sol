pragma solidity >=0.4.24;

import 'tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol';
import './Adapters/IAdapter.sol';

contract OracleManagerDataFeed is DataFeedOracleBase {
  address public token1;
  address public token2;

  function initialize(address _token1, address _token2, address dataSource) public {
    token1 = _token1;
    token2 = _token2;
    super.initialize(dataSource);
  }

  function logResult() public {
    IAdapter(dataSource).ping(token1, token2);
  }
}
