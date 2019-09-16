/**
 * Saves an archive file for the given IPFS root hash
 */

const fs = require('fs')
const readArappEnv = require('../deployConfig/readArappEnv')

const environment = process.argv[2]
const version = process.argv[3]
const rootHash = process.argv[4]

const archivePath = 'ipfs_archives'
const path = `${archivePath}/${environment}`

function mkdir (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function getAppName () {
  const { appName } = readArappEnv(environment)
  return appName
}

async function getIpfsArchive () {
  const archiveFileName = `${path}/${getAppName()}@${version}`
  const run = await runExecaWithOutput('ipfs', [
    'get',
    '-a',
    '-C',
    '-o',
    archiveFileName,
    rootHash
  ])
  console.log(`Created archive ${archiveFileName}.tar.gz`)
  return run
}

async function run () {
  mkdir(archivePath)
  mkdir(path)
  await getIpfsArchive(rootHash)
}

async function runExecaWithOutput (cmd, args) {
  const run = await runExeca(cmd, args, true)
  return run
}

async function runExeca (cmd, args, output) {
  console.log(`${cmd} ${args.join(' ')}`)
  const promise = execa(cmd, args)
  if (output) {
    promise.stdout.pipe(process.stdout)
  }
  const run = await promise
  return run
}

run()
