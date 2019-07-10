pragma solidity >=0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import 'tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol';
import 'tidbit/contracts/DataFeedOracles/DataFeedOracle.sol';
import "./ITidbitDataFeedOracle.sol";

contract OracleManagerApp is AragonApp {
  
  event DataFeedAdded(address dataFeedAddress);
  event DataFeedRemoved(address dataFeedAddress);

  bytes32 public constant MANAGE_DATA_FEEDS = keccak256("MANAGE_DATA_FEEDS");

  ITidbitDataFeedOracle public medianDataFeed;  // tidbit MedianDataFeedOracle to record median data throughout time
  uint public approvedDataFeedsLength;   // number of approvedDataFeeds
  mapping(address => bool) public approvedDataFeeds; // dataFeeds approved to be medianized
  mapping(address => bool) public dataFeedRecorded; // transitory data structure useful only during function call recordDataMedian

  /**
  * @dev Initializes OracleManagerApp
  * @param _medianDataFeed The data feed that medianizes approvedDataFeeds and records result throughout time
  */
  function initialize(DataFeedOracleBase[] memory dataFeeds, ITidbitDataFeedOracle _medianDataFeed)
    public
    onlyInit
  {
    initialized();
  
    medianDataFeed = _medianDataFeed;

    for(uint i=0; i < dataFeeds.length; i++) {
      _addDataFeed(dataFeeds[i]);
    }
  }

  /**
  * @dev calls medianDataFeed with approvedDataFeeds to record median at current moment in time
  * @param dataFeeds All the approvedDataFeeds in ascending order by result
  */
  function recordDataMedian(DataFeedOracleBase[] dataFeeds)
    external
  {
    // require all dataFeeds are approved, all approved dataFeeds are included, and no dataFeeds are duplicated
    require(dataFeeds.length == approvedDataFeedsLength);
    for(uint i=0; i < dataFeeds.length; i++) {
      require(approvedDataFeeds[address(dataFeeds[i])], 'dataFeed is not approved');
      require(!dataFeedRecorded[address(dataFeeds[i])], 'dataFeed cannot be a duplicate');
      dataFeedRecorded[dataFeeds[i]] = true;
    }

    medianDataFeed.setResult(dataFeeds);

    // reset dataFeedRecorded
    for(uint j=0; j < dataFeeds.length; j++) {
      dataFeedRecorded[dataFeeds[j]] = false;
    }
  }

  /**
  * @dev Auth protected function to add a dataFeed
  * @param dataFeed The dataFeed to be added
  */
  function addDataFeed(DataFeedOracleBase dataFeed)
    external
    auth(MANAGE_DATA_FEEDS)
  {
    _addDataFeed(dataFeed);
  }

  /**
  * @dev Auth protected function to remove a dataFeed
  * @param dataFeed The dataFeed to be removed
  */
  function removeDataFeed(DataFeedOracleBase dataFeed)
    external
    auth(MANAGE_DATA_FEEDS)
  {
    _removeDataFeed(dataFeed);
  }

  /**
  * @dev Adds approved dataFeed to be medianized
  * @param dataFeed The dataFeed to be added
  */
  function _addDataFeed(DataFeedOracleBase dataFeed)
    internal
  {
    require(!approvedDataFeeds[address(dataFeed)], 'cannot add duplicate oracle');
    approvedDataFeedsLength++;
    approvedDataFeeds[address(dataFeed)] = true;
    medianDataFeed.addDataFeed(dataFeed);

    emit DataFeedAdded(address(dataFeed));
  }

  /**
  * @dev Removes an approved dataFeed
  * @param dataFeed The dataFeed to be removed
  */
  function _removeDataFeed(DataFeedOracleBase dataFeed)
    internal
  {
    require(approvedDataFeeds[address(dataFeed)], 'cannot remove unapproved oracle');
    approvedDataFeedsLength--;
    approvedDataFeeds[address(dataFeed)] = false;
    medianDataFeed.removeDataFeed(dataFeed);

    emit DataFeedRemoved(address(dataFeed));
  }
}
