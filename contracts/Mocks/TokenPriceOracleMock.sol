import 'tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol';

contract TokenPriceDataFeedMock is DataFeedOracleBase {
  address public token1;
  address public token2;
  address public exchangeAdapter;
  uint public price;

  function initialize(
    address _token1,
    address _token2,
    address _exchangeAdapter
  )
    public
  {
    token1 = _token1;
    token2 = _token2;
    exchangeAdapter = _exchangeAdapter;

    // set dataSource to `this` so setResult can only be called from this contract
    DataFeedOracleBase.initialize(address(this));
  }

  function logResult() public {
    DataFeedOracleBase(this).setResult(bytes32(price), uint256(block.timestamp));
  }

  function mock_setResult(uint num) public {
    price = num * 10 ** 18;
  }
}
