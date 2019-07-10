pragma solidity ^0.4.24;

import "tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

contract TimeMedianDataFeedOracle is DataFeedOracleBase {
  using SafeMath for uint;

  event Medianized(bytes32 median, uint startDate, uint endDate);
  event SelectedDates(uint, uint, uint, uint, uint, uint, uint, uint, uint, uint);
  event PartitionDates(uint, uint, uint, uint, uint, uint, uint, uint, uint, uint);
  event Date(uint date);

  function medianizeByTimeframe(uint startDate, uint endDate) public returns (bytes32 medianValue) {
    require(startDate < endDate, 'startDate must be less than endDate');
    uint endIndex;
    uint startIndex;

    // find end date within dates array
    for (uint i = dates.length - 1; i > 0 && endIndex == 0; i--) {
      if (dates[i] <= endDate) {
        endIndex = i; // ONLY dates before the end date
      }
    }

    // require endIndex is more than 0
    require(endIndex > 0, 'dates outside of range of datafeed results');
    require(dates[endIndex] >= startDate, 'dates outside of range of datafeed results');

    // find start date within dates array
    for (uint j = endIndex; j >= 0 && startIndex == 0; j--) {
      if (dates[j] < startDate) {
        startIndex = j + 1; // no dates before the startDate
      }
    }

    uint[] memory sd = _createPartialArray(startIndex, endIndex);
    uint[] memory pt = partitionDates(sd);
    medianValue = results[pt[pt.length / 2]];
    emit Medianized(medianValue, startDate, endDate);
    /* emit SelectedDates(pt[0], pt[1], pt[2], pt[3], pt[4], pt[5], pt[6], pt[7], pt[8], pt[9]);
    emit PartitionDates(uint(results[pt[0]]), uint(results[pt[1]]), uint(results[pt[2]]), uint(results[pt[3]]),
      uint(results[pt[4]]), uint(results[pt[5]]), uint(results[pt[6]]), uint(results[pt[7]]), uint(results[pt[8]]),
      uint(results[pt[9]])); */

    /* emit Date(pt[9]); */
  }

  function medianizeByDates(uint[] orderedDates) public returns (bytes32 medianvalue) {
    for (uint i = 0; i < orderedDates.length; i++) {
      uint date = orderedDates[i];
      uint nextDate = orderedDates[i+1];
      require(isResultSetFor(date), "Date not set.");
      if(i != orderedDates.length - 1) {
        require(uint(results[date]) <= uint(results[nextDate]), "The dates are not sorted by result.");
      }
    }
    return _medianizeByDates(orderedDates);
  }

  function _medianizeByDates(uint[] orderedDates) private returns (bytes32 medianValue) {
    uint middleIndex = orderedDates.length / 2;
    uint middleDate  = orderedDates[middleIndex];
    medianValue = results[middleDate];
  }

  function partitionDates(uint[] selectedDates) private returns (uint[]) {
    // To minimize complexity, return the higher of the two middle checkpoints in even-sized arrays instead of the average.
    uint k = selectedDates.length.div(2);
    uint left = 0;
    uint right = selectedDates.length.sub(1);

    while (left < right) {
        uint pivotIndex = left.add(right).div(2);
        uint pivotValue = selectedDates[pivotIndex];

        (selectedDates[pivotIndex], selectedDates[right]) = (selectedDates[right], selectedDates[pivotIndex]);
        uint storeIndex = left;
        for (uint i = left; i < right; i++) {
            if (_isLessThan(selectedDates[i], pivotValue)) {
                (selectedDates[storeIndex], selectedDates[i]) = (selectedDates[i], selectedDates[storeIndex]);
                storeIndex++;
            }
        }

        (selectedDates[storeIndex], selectedDates[right]) = (selectedDates[right], selectedDates[storeIndex]);
        if (storeIndex < k) {
            left = storeIndex.add(1);
        } else {
            right = storeIndex;
        }
    }

    return selectedDates;
  }

  function resultByIndex(uint256 index) external view returns (bytes32) {
    require(doesIndexExistFor(index), "The index is not been set yet.");
    return results[dates[index]];
  }

  function _createPartialArray(uint start, uint end) private returns (uint[]) {
    uint length = end - start + 1;
    uint[] memory arr = new uint[](length);
    uint index = 0;
    for (uint i = start; i <= end; i++) {
        arr[index] = dates[i];
        index++;
    }
    return arr;
  }

  function _isLessThan(uint date1, uint date2) public returns (bool) {
    return uint(results[date1]) > uint(results[date2]);
  }
}
