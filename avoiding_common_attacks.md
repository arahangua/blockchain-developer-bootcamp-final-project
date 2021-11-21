For this project,

1) Using specific compiler version (SWC-103, 102) : Used solidity compiler version 0.8.7 

2) Protected against Re-entrancy (SWC-107)
: this project uses 'nonReentrant' modifier of Openzeppelin library for its main functions

3) Protected against integer overflow (SWC-101)
: this project uses 'SafeMath' Openzeppelin library for uint256, int256 variable types (*sol compiler version higher than 0.8 is known to do auto-check on overflows so this could have been redundant measure)

4) Protected against transactions including insecure addresses (SWC-112?)
: this project uses 'Address' library from Openzeppelin for address variables. Nevertheless, for the current level of implementation, there is no explicit token transaction between addresses yet.