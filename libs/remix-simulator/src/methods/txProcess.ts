import { execution } from '@remix-project/remix-lib'
const TxExecution = execution.txExecution

function runCall (payload, from, to, data, value, tokenId, tokenValue, gasLimit, txRunner, callbacks, callback) {
  const finalCallback = function (err, result) {
    if (err) {
      return callback(err)
    }
    return callback(null, result)
  }

  TxExecution.callFunction(from, to, data, value, tokenId, tokenValue, gasLimit, { constant: true }, txRunner, callbacks, finalCallback)
}

function runTx (payload, from, to, data, value, tokenId, tokenValue, gasLimit, txRunner, callbacks, callback) {
  const finalCallback = function (err, result) {
    if (err) {
      return callback(err)
    }
    callback(null, result)
  }

  TxExecution.callFunction(from, to, data, value, tokenId, tokenValue, gasLimit, { constant: false }, txRunner, callbacks, finalCallback)
}

function createContract (payload, from, data, value, tokenId, tokenValue, gasLimit, txRunner, callbacks, callback) {
  const finalCallback = function (err, result) {
    if (err) {
      return callback(err)
    }
    callback(null, result)
  }

  TxExecution.createContract(from, data, value, tokenId, tokenValue, gasLimit, txRunner, callbacks, finalCallback)
}

export function processTx (txRunnerInstance, payload, isCall, callback) {
  let { from, to, data, value, tokenId, tokenValue, gas } = payload.params[0]
  gas = gas || 3000000

  const callbacks = {
    confirmationCb: (network, tx, gasEstimation, continueTxExecution, cancelCb) => {
      continueTxExecution(null)
    },
    gasEstimationForceSend: (error, continueTxExecution, cancelCb) => {
      if (error) {
        continueTxExecution(error)
      }
      continueTxExecution()
    },
    promptCb: (okCb, cancelCb) => {
      okCb()
    }
  }

  if (isCall) {
    runCall(payload, from, to, data, value, tokenId, tokenValue, gas, txRunnerInstance, callbacks, callback)
  } else if (to) {
    runTx(payload, from, to, data, value, tokenId, tokenValue, gas, txRunnerInstance, callbacks, callback)
  } else {
    createContract(payload, from, data, value, tokenId, tokenValue, gas, txRunnerInstance, callbacks, callback)
  }
}
