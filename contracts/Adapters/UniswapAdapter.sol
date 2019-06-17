pragma solidity >=0.4.24;

import './IAdapter.sol';
import './dependencies/UniswapExchangeInterface.sol';
import './dependencies/UniswapFactoryInterface.sol';
import "@aragon/os/contracts/lib/math/SafeMath.sol";

contract UniswapAdapter is IAdapter {
  using SafeMath for uint;

  UniswapFactoryInterface uniswapFactory;

  constructor(address _uniswapFactory) {
    uniswapFactory = UniswapFactoryInterface(_uniswapFactory);
  }

  function ping(address token1, address token2) public returns (uint price) {
    UniswapExchangeInterface token1Exchange = UniswapExchangeInterface(uniswapFactory.getExchange(token1));
    UniswapExchangeInterface token2Exchange = UniswapExchangeInterface(uniswapFactory.getExchange(token2));

    uint256 token1PriceEth = token1Exchange.getTokenToEthInputPrice(1 ether);
    uint256 token2PriceEth = token2Exchange.getTokenToEthInputPrice(1 ether);

    return token1PriceEth.div(token2PriceEth);
  }
}
