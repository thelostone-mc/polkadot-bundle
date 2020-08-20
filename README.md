#### polkadot-bundle

These bundles have been generated using browserify.
It consists of the core, extension and util libraries which can be used to

- Import needed polkadot modules
- Connect to polkadot network
- Sign transactions via extension

```html
  <script src="polkadot/core.js"></script>      <!-- Polkadot core bundle -->
  <script src="polkadot/extension.js"></script> <!-- Polkadot extension bundle -->
  <script src="polkadot/utils.js"></script>     <!-- helper function which uses above bundle -->
```

##### Utils

- `connect`
- `getBlockTimestamp`
- `getBlockHash`
- `getAddressBalance`
- `web3Enable`
- `getExtensionConnectedAccounts`
- `transferViaExtension`

To sign a transaction using the plugin

```javascript

  const to_address = 'GZoo68t6icqNENrd7CTC9RCwVLszGuubKo5oGp7WSFxRnv2';
  polkadot_utils.connect(KUSAMA_ENDPOINT);       // connect to wss endpoint
  polkadot_extension_dapp.web3Enable('gitcoin'); // enable web3 via dapp
  polkadot_extension_dapp(200, to_address);        // sign transaction

```