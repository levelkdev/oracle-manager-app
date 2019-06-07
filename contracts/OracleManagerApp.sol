pragma solidity ^0.4.24;

import 'tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol';
import 'tidbit/contracts/DataFeedOracles/DataFeedOracle.sol';
import '@aragon/os/contracts/apps/AragonApp.sol';

contract OracleManagerApp is AragonApp {

  DataFeedOracle public medianDataFeed;  // tidbit MedianDataFeedOracle to record median data throughout time
  uint public approvedDataFeedsLength;   // number of approvedDataFeeds
  mapping(address => bool) public permissionedAccounts; // addresses permitted to add and remove oracles (will probably replace with Aragon's ACL permissions)
  mapping(address => bool) public approvedDataFeeds; // dataFeeds approved to be medianized
  mapping(address => bool) dataFeedAlreadyRecorded; // transitory data structure useful only during function call recordDataMedian


  modifier onlyPermissionAccount(address account) {
    require(permissionedAccounts[account]);
    _;
  }

  /**
  * @dev initializes the OracleManagerApp with initial parameters
  * @param _permissionedAccounts Addresses allowed to add and remove approvedDataFeeds
  * @param dataFeeds data feeds to approve
  * @param _medianDataFeed The data feed that medianize approvedDataFeeds and record result throughout time
  */
  function initialize(
    address[] memory _permissionedAccounts,
    DataFeedOracleBase[] memory dataFeeds,
    DataFeedOracle _medianDataFeed
  ) onlyInit public {
    medianDataFeed = _medianDataFeed;
    approvedDataFeedsLength = dataFeeds.length;

    for(uint i=0; i < dataFeeds.length; i++) {
      require(approvedDataFeeds[dataFeeds[i]] == false, 'dataFeed cannot be a duplicate');
      approvedDataFeeds[dataFeeds[i]] = true;
    }

    for(uint j=0; j < _permissionedAccounts.length; j++) {
      permissionedAccounts[_permissionedAccounts[j]] = true;
    }
  }

  /**
  * @dev calls medianDataFeed with approvedDataFeeds to record median at current moment in time
  * @param dataFeeds All the approvedDataFeeds in ascending order by result
  */
  function recordDataMedian(DataFeedOracleBase[] memory dataFeeds) public {
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
}
