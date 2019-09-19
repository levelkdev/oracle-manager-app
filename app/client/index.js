import { logDebug, logError } from '../util/logger'
import contractFn from './contractFn'
import contractCall from './contractCall'
import IDataFeed from './IDataFeed'

export const call = (functionName, ...params) => {
  return contractCall(window.aragonClient, 'client', functionName, ...params)
}

export const getMedianDataFeedInfo = async () => {
  return Promise.all([
    call('contractAddress'),
    call('latestResult'),
    call('latestResultDate')
  ])
}

export const addDataFeed = async ({ dataFeedAddress }) => {
  return contractFn(
    window.aragonClient,
    'client',
    'addDataFeed',
    dataFeedAddress
  )
}

export const removeDataFeed = async ({ dataFeedAddress }) => {
  return contractFn(
    window.aragonClient,
    'client',
    'removeDataFeed',
    dataFeedAddress
  )
}

export const getDataFeedLatestResult = async ({ dataFeedAddress }) => {
  const iDataFeed = await IDataFeed(window.aragonClient, dataFeedAddress)
  const currentResult = await iDataFeed.currentPrice()
  const lastUpdated = await iDataFeed.lastUpdated()

  return {
    currentResult,
    lastUpdated
  }
}

export const getDataFeedCurrentResult = async ({ dataFeedAddress }) => {
  const iDataFeed = await IDataFeed(window.aragonClient, dataFeedAddress)
  const currentResult = await iDataFeed.viewCurrentResult()
  return currentResult
}

export const logDataFeedResult = async ({ dataFeedAddress }) => {
  return contractFn(
    window.aragonClient,
    'client',
    'updateDataFeedResult',
    dataFeedAddress
  )
}

export const logMedianDataFeedResult = async (dataFeeds) => {
  return contractFn(
    window.aragonClient,
    'client',
    'setResult',
    dataFeeds
  )
}

export const updateAllDataFeeds = async ({ dataFeedAddrs }) => {
  return contractFn(
    window.aragonClient,
    'client',
    'updateAll',
    dataFeedAddrs
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
  getDataFeedLatestResult,
  getMedianDataFeedInfo,
  getDataFeedCurrentResult,
  logDataFeedResult,
  logMedianDataFeedResult,
  updateAllDataFeeds
}
