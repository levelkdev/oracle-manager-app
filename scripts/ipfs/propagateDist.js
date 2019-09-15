/**
 * Uses aragon CLI to propagate IPFS /dist/ directory content given the root hash
 */

const execa = require('execa')

const rootHash = process.argv[2]

async function ipfsResolve (hash) {
  const ipfsRes = await runExeca('ipfs', ['resolve', `${rootHash}/dist`])
  const distHash = ipfsRes.stdout.replace('/ipfs/', '')
  return distHash
}

async function ipfsPropagate (hash) {
  const run = await runExecaWithOutput('aragon', ['ipfs', 'propagate', hash])
  return run
}

async function run () {
  const distHash = await ipfsResolve(rootHash)
  console.log('')

  console.log(`resolved hash of the /dist/ directory: ${distHash}`)
  console.log('')

  await ipfsPropagate(distHash)
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

