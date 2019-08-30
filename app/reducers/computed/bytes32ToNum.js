const web3_utils = require('web3-utils')

module.exports = function bytes32ToNum(bytes32str) {
    bytes32str = bytes32str.replace(/^0x/, '');
    while (bytes32str[0] == 0) {
      bytes32str = bytes32str.substr(1)
    }

    var bn = web3_utils.toDecimal('0x' + bytes32str, 16);
    return bn
}
