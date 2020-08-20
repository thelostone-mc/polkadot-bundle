var polkadot_utils = {};
global = {};

const KUSAMA_ENDPOINT = 'wss://kusama-rpc.polkadot.io/';
const POLKADOT_ENDPOINT = 'wss://rpc.polkadot.io';

/**
 * connects to the polkadot provider based on the rpc provider
 * @param {String} polkadot_network
 */
polkadot_utils.connect = async polkadot_network => {
  if (window.polkadot_substrate && document.polkadot_network == polkadot_network) {
    return Promise.resolve(`connect: already connected to ${polkadot_network}`);
  }

  const provider = new polkadot_api.WsProvider(polkadot_network);
  console.log(`connecting to ${polkadot_network} ...`);

  window.polkadot_substrate = await polkadot_api.ApiPromise.create({ provider });
  global.polkadot_network = polkadot_network;
  return Promise.resolve(`connected to ${polkadot_network}!`);
}

/**
 * Get timestamp of current block on the connected polkadot network
 */
polkadot_utils.getBlockTimestamp = async () => {
  if (!global.polkadot_network || !window.polkadot_substrate) return;

  const timestamp = await polkadot_substrate.query.timestamp.now();
  return Promise.resolve(Date(timestamp));
}

/**
 * Return latest / specifc block's blockhash on the connected polkadot network
 * @param {Number} blockNumber
 */
polkadot_utils.getBlockHash = async blockNumber => {
  if (!global.polkadot_network || !window.polkadot_substrate) return;

  const blockHash = await polkadot_substrate.rpc.chain.getBlockHash(blockNumber);
  return Promise.resolve(blockHash.toString());
}

/**
 * Returns wallet's balance on the connected polkadot network
 * @param {String} address
 */
polkadot_utils.getAddressBalance = async address => {
  if (!global.polkadot_network || !window.polkadot_substrate || !address) return;

  const account = await polkadot_substrate.query.system.account(address);
  return Promise.resolve(account && account.data ? account.data.free.toString() : 0);
}

/**
 * Get address connected in extension
 */
polkadot_utils.getExtensionConnectedAccounts = async () => {
  if (!global.polkadot_network || !window.polkadot_substrate) return;

  const accounts = await polkadot_extension_dapp.web3Accounts();
  return Promise.resolve(accounts);
}

/**
 * Seek permission from extension
 * @param {*} app_name
 */
polkadot_utils.web3Enable = async app_name => {
  const web3Enable = await polkadot_extension_dapp.web3Enable(app_name);
  return Promise.resolve(web3Enable);
}

/**
 * Sign and transfer token to another address via extension and returns txn hash
 * @param {Number} amount
 * @param {String} to_address
 * @param {String} from_address : optional, if not passed takes account first account from getExtensionConnectedAccounts
 */
polkadot_utils.transferViaExtension = async (amount, to_address, from_address) => {

  if (!global.polkadot_network  || !amount || !to_address) {
    return Promise.reject('transferViaExtension: missing param polkadot_network');
  } else if (!window.polkadot_substrate) {
    return Promise.reject(`transferViaExtension: missing param polkadot_substrate`);
  } else if (!amount) {
    return Promise.reject(`transferViaExtension: missing param amount`);
  } else if (!to_address) {
    return Promise.reject(`transferViaExtension: missing param to_address`);
  }

  if (!from_address) {
    const accounts = await polkadot_utils.getExtensionConnectedAccounts();
    from_address = accounts && accounts[0].address;
  }

  if (!from_address) {
    return Promise.reject("transferViaExtension: missing param from_address");
  }

  const account_balance = await polkadot_utils.getAddressBalance(from_address);
  if (Number(account_balance) < amount) {
    return Promise.reject(`transferViaExtension: insufficent balance in address ${from_address}`);
  }

  const injector = await polkadot_extension_dapp.web3FromAddress(from_address);

  polkadot_substrate.setSigner(injector.signer)

  const tx = await polkadot_substrate.tx.balances.transfer(to_address, amount);

  const unsub = tx.signAndSend(from_address, result => {

    if (result.status.isInBlock) {
      console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
    } else if (result.status.isFinalized) {
      console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
      unsub();
    }
  });

  return Promise.resolve(tx);
}