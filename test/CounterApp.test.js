const Counter = artifacts.require('./CounterApp.sol')

contract('Counter App', (accounts) => {
  let counterApp
  beforeEach(async () => {
    counterApp = await  Counter.new()
  })

  it('should start with a value of 0', async () => {
    expect((await counterApp.value()).toNumber()).to.equal(0)
  })
})
