// contracts/CounterApp.sol
pragma solidity 0.4.24;

contract CounterApp {
    // Events
    event Increment(address entity);
    event Decrement(address entity);

    // State
    int public value;

    function increment() external {
        value += 1;
        emit Increment(msg.sender);
    }

    function decrement() external {
        value -= 1;
        emit Decrement(msg.sender);
    }
}
