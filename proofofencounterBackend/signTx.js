export const sendTransaction = async (req, res) => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const { data } = req.body;
      const decryptedPrivateKey = await getDecryptedPrivateKey();
      const privateKey = `0x${decryptedPrivateKey}`;
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const nonce = await web3.eth.getTransactionCount(account.address);
      const transactionObject = {
        from: account.address,
        to: Config.DSHARE.ADDRESS,
        gasPrice,
        gas: gasLimit,
        data,
        nonce,
      };
  
      const signedTransaction = await web3.eth.accounts.signTransaction(
        transactionObject,
        privateKey
      );
  
      let transactionHash;
      let receipt;
  
try {
    console.log("Sending transaction from admin wallet ...");
    const txResponse = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    transactionHash = txResponse.transactionHash;

    // Wait for the transaction to be mined
    receipt = await waitForTransactionReceipt(transactionHash);
  } catch (error) {
    console.error(`Error sending transaction: ${error.message}`);
    throw new Error(`Error sending transaction: ${error.message}`);
  }

  const transactionStatus = receipt.status.toString();
  console.log("transaction status: ", transactionStatus);
  console.log(transactionStatus, transactionHash);

  return res.send({ transactionStatus, transactionHash });
} catch (error) {
  console.error("Error:", error.message);
  return res.status(500).send({ error: error.message });
  }
};