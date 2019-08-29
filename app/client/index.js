import { logDebug, logError } from '../util/logger'
import contractFn from './contractFn'
import TokenPriceDataFeed from './TokenPriceDataFeed'

export const getDataFeedLatestResult = async ({ address }) => {
  const tokenPriceDataFeed = await TokenPriceDataFeed(window.aragonClient, address)
  const currentResult = await tokenPriceDataFeed.currentPrice()
  const lastUpdated = await tokenPriceDataFeed.lastUpdated()

  return {
    currentResult,
    lastUpdated
  }
}

export const addDataFeed = async ({ address }) => {
  return contractFn(
    window.aragonClient,
    'client',
    'addDataFeed',
    address
  )
}

export const removeDataFeed = async ({ address }) => {
  return contractFn(
    window.aragonClient,
    'client',
    'removeDataFeed',
    address
  )
}

export const accounts = async () => {
  return new Promise((resolve, reject) => {
    window.aragonClient.accounts().subscribe(
      accounts => {
        logDebug('client.accounts(): ', accounts)
        resolve(accounts)
      },
      err => {
        logError('client.accounts(): Error: ', err)
        reject(err)
      }
    )
  })
}

export const latestBlock = async () => {
  return new Promise((resolve, reject) => {
    window.aragonClient.web3Eth('getBlock', 'latest').subscribe(
      block => {
        logDebug('client.latestBlock: ', block)
        resolve(block)
      },
      err => {
        logError('client.latestBlock: Error: ', err)
        reject(err)
      }
    )
  })
}

export default {
  accounts,
  latestBlock,
  addDataFeed,
  removeDataFeed,
  getDataFeedLatestResult
}
