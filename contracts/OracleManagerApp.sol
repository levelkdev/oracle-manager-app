pragma solidity >=0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "./ITidbitDataFeedOracle.sol";

contract OracleManagerApp is AragonApp {
  bytes32 public constant MANAGE_DATA_FEEDS = keccak256("MANAGE_DATA_FEEDS");

  ITidbitDataFeedOracle public medianDataFeed;  // tidbit MedianDataFeedOracle to record median data throughout time
  uint public approvedDataFeedsLength;   // number of approvedDataFeeds
  mapping(address => bool) public approvedDataFeeds; // dataFeeds approved to be medianized
  mapping(address => bool) dataFeedAlreadyRecorded; // transitory data structure useful only during function call recordDataMedian

  /**
  * @dev Initializes OracleManagerApp
  * @param _medianDataFeed The data feed that medianizes approvedDataFeeds and records result throughout time
  */
  function initialize(ITidbitDataFeedOracle _medianDataFeed)
    public
    onlyInit
  {
    medianDataFeed = _medianDataFeed;
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
      require(!dataFeedAlreadyRecorded[address(dataFeeds[i])], 'dataFeed cannot be a duplicate');
      dataFeedAlreadyRecorded[dataFeeds[i]] = true;
    }

    medianDataFeed.setResult(dataFeeds);

    // reset dataFeedAlreadyRecorded
    for(uint j=0; j < dataFeeds.length; j++) {
      dataFeedAlreadyRecorded[dataFeeds[j]] = false;
    }
  }

  /**
  * @dev Adds approved dataFeed to be medianized
  * @param dataFeed The dataFeed to be approved for this instance of OracleManagerApp
  */
  function addDataFeed(DataFeedOracleBase dataFeed) 
    external
    auth(MANAGE_DATA_FEEDS)
  {
    require(!approvedDataFeeds[address(dataFeed)], 'cannot add duplicate oracle');
    approvedDataFeedsLength++;
    approvedDataFeeds[address(dataFeed)] = true;
    medianDataFeed.addDataFeed(dataFeed);
  }

  /**
  * @dev Removes an approved dataFeed
  * @param dataFeed The dataFeed to be approved for this instance of OracleManagerApp
  */
  function removeDataFeed(DataFeedOracleBase dataFeed) 
    external
    auth(MANAGE_DATA_FEEDS)
  {
    require(approvedDataFeeds[address(dataFeed)], 'cannot remove unapproved oracle');
    approvedDataFeedsLength--;
    approvedDataFeeds[address(dataFeed)] = false;
    medianDataFeed.removeDataFeed(dataFeed);
  }
}
