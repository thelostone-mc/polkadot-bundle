// const { async } = require("./polkadot");

global = {};

const KUSAMA_ENDPOINT = 'wss://kusama-rpc.polkadot.io/';

// TODO: POLKADOT

async function connect(pdot_network) {
  if (!window.pdot_substrate || document.pdot_network != pdot_network) {
  
    const provider = new api.WsProvider(pdot_network);
    console.log(`connecting to ${pdot_network} ...`)
    
    window.pdot_substrate = await api.ApiPromise.create({ provider });
    global.pdot_network = pdot_network;
    console.log(`connected to ${pdot_network}!`)
  }
}

/**
 * Get timestamp of current block on the connected polkadot network
 */
async function getBlockTimestamp() {
  if (!global.pdot_network || !window.pdot_substrate) return;

  const timestamp = await pdot_substrate.query.timestamp.now();
  return Date(timestamp);
}

/**
 * Return latest / specifc block's blockhash on the connected polkadot network
 * @param {*} blockNumber 
 */
async function getBlockHash(blockNumber) {
  if (!global.pdot_network || !window.pdot_substrate) return;

  const blockHash = await pdot_substrate.rpc.chain.getBlockHash(blockNumber);
  return blockHash.toString()
}

/**
 * Returns wallet's balance on the connected polkadot network
 * @param {*} address 
 */
async function getWalletBalance(address) {
  if (!global.pdot_network || !window.pdot_substrate || !address) return;

  const account = await pdot_substrate.query.system.account(address);
  return account && account.data ? account.data.free.toString() : 0;
}

async function transfer(to_address, amount) {
  let BOB = 'D6WbYsy1o7cFkjA5yqPEwMQjdiTdBVafUewd94K8pmu6F2k';
  // const mm = new keyring({ type: 'sr25519' });

  // const alice = mm.addFromUr/i('//Alice');
  const unsub = await pdot_substrate.tx.balances
  .transfer(BOB, 12345)
  .sign(keyring, (result) => {
    console.log(`Current status is ${result.status}`);

    if (result.status.isInBlock) {
      console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
    } else if (result.status.isFinalized) {
      console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
      unsub();
    }
  });
}

connect(KUSAMA_ENDPOINT);
