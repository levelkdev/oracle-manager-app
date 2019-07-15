import assert from 'assert'
import { filterNewEvents, pascalToUpperSnake } from './aragonRedux'

const mockEvent1 = { event: 'MOCK_EVENT', transactionHash: 'a1b2c3' }
const mockEvent2 = { event: 'MOCK_EVENT', transactionHash: 'd4e5f6' }
const mockEventNoTxHash = { event: 'MOCK_EVENT' }

const mockEventStateInitial = [ mockEvent1 ]
const mockEventStateFinal = [ mockEvent1, mockEvent2 ]
const mockEventStateWithUndefined = [ undefined, mockEvent1 ]
const mockEventStateWithoutTxHash = [ mockEventNoTxHash, mockEvent1 ]

describe('aragonRedux', () => {
  describe('filterNewEvents()', () => {
    describe('when given different initial and final event states', () => {
      it('should return an array of the new events', () => {
        assert.deepEqual(
          filterNewEvents(mockEventStateInitial, mockEventStateFinal),
          [ mockEvent2 ]
        )
      })
    })

    describe('when final event state array has an undefined value', () => {
      it('should return an array of the new events without the undefined value', () => {
        assert.deepEqual(
          filterNewEvents([], mockEventStateWithUndefined),
          [ mockEvent1 ]
        )
      })
    })

    describe('when initial event state array has an undefined value', () => {
      it('should return an array of the new events without the undefined value', () => {
        assert.deepEqual(
          filterNewEvents(mockEventStateWithUndefined, mockEventStateFinal),
          [ mockEvent2 ]
        )
      })
    })

    describe('when final event state array has an event with no transaction hash', () => {
      it('should return an array of the new events without that value', () => {
        assert.deepEqual(
          filterNewEvents([], mockEventStateWithoutTxHash),
          [ mockEvent1 ]
        )
      })
    })

    describe('when initial event state array has an event with no transaction hash', () => {
      it('should return an array of the new events without that value', () => {
        assert.deepEqual(
          filterNewEvents(mockEventStateWithoutTxHash, mockEventStateFinal),
          [ mockEvent2 ]
        )
      })
    })

    describe('when given the same initial and final event states', () => {
      it('should return an empty array', () => {
        assert.deepEqual(
          filterNewEvents(mockEventStateFinal, mockEventStateFinal),
          [ ]
        )
      })
    })
  })

  describe('pascalToUpperSnake', () => {
    describe('when given \'TestName\'', () => {
      it('should return \'TEST_NAME\'', () => {
        assert.equal(pascalToUpperSnake('TestName'), 'TEST_NAME')
      })
    })
  })
})
