# Oracle Manager App

App for managing oracles on aragon

## Setup

1. `npm install`

2. `npm run compile`

## Run

1. `npm run start:app`: builds the frontend to `dist/`

2. `npm run devchain`: starts a local aragon [devchain](https://hack.aragon.org/docs/cli-usage.html#aragon-devchain)

3. `npm run start:aragon`:
  * deploys contract dependencies
  * publishes the oracle manager app
  * creates a new oracle manager DAO instance
  * starts the aragon app

## Scripts

### Seeding data

Seeding scripts in `scripts/seed_data` can be used to seed the UI with decisions and market trades.

To run the scripts, first run through the "Run" instructions above. Make sure all processes have succeeded and are running. Then:

1. Copy the DAO address from the URL of the app. This can be found in the `npm run start:aragon` output:

```
Open DAO [completed]
 ℹ You are now ready to open your app in Aragon.

 ℹ This is the configuration for your development deployment:
    Ethereum Node: ws://localhost:8545
    ENS registry: 0x5f6f7e8cc7346a11ca2def8f827b7a0b612c56a1
    APM registry: aragonpm.eth
    DAO address: 0x5b48408a77645bd31e5eBaa460E84B588eaae1d4

    Opening http://localhost:3000/#/0x5b48408a77645bd31e5eBaa460E84B588eaae1d4 to view your DAO
```

2. Run `npm run seed <DAO_ADDRESS>`. Replace `<DAO_ADDRESS>` with your copied address

When these succeed, you will see 3 decisions in the UI. If you click on the first decision, you will see a series of trades.

To run a specific seed file, use `npm run seed <DAO_ADDRESS> [DATA_FILE_ID]`. The file ID can be found in the file name `scripts/data/data_<DATA_FILE_ID>.json`. If no ID is specified, the seed script defaults to running with the `scripts/data/data_0.json` file.

### `npm run devchain:reset`

Starts the devchain with `--reset`, which deletes existing ganache snapshots

**NOTE: aragon caches event data using indexdb. You need to clear your browser cache after the devchain is reset

## Debug Mode

Run `npm run start:app:debug` (instead of `npm run start:app`) to log all activity in the client. This will log info about all Aragon smart contract events, calls, and transactions.

## Sandbox Setup (for Component UI development)

Use this to develop components without having to depend on the "backend" smart contract environment:

1. First, `npm install`

2. Run `npm run start:app` to build the frontend to the `dist` dir and watch for changes.

3. Run `npm run start:sandbox` to serve the frontend at `http://localhost:8080`

4. Modify `./app/components/DecisionListEmptyState.js` to add the component you're working on. This is the default view, so you should see changes here when you refresh the browser.

If something breaks, just restart the `npm run start:app` and `npm run start:sandbox` processes.

## Styling

We're using react [styled-components](https://www.styled-components.com/docs/basics), which allow you to add CSS within the component .js files. See `./app/components/AppHeader.js` for a good example of this.

## Publishing

Before publishing, make sure a local IPFS instance is running: `npm run ipfs`

### `npm run deploy:staging:prepare`:

Deploys these dependency contracts to staging (rinkeby). Allocates balances for the `MiniMeToken` to the accounts in `accounts.rinkeby.json`.

Deployed contract addresses and token allocation amounts will be stored in `deploy.rinkeby.json`.

### `npm run deploy:staging:publish:major`:

Publishes a new "major" version of the Oracle Manager app to staging (rinkeby).

### `npm run deploy:staging:publish:minor`:

Publishes a new "minor" version of the Oracle app to staging (rinkeby).

## Deploying a Oracle DAO

Before deploying, make sure a local IPFS instance is running: `npm run ipfs`

### `deploy:staging:newOracleDAO`

Deploys a new DAO on staging (rinkeby), installs on instance of the oracle app `oracle-manager.open.aragonpm.eth`, and sets permissions for the deployer account.
