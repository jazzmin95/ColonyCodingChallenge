import { takeEvery, put } from "redux-saga/effects";
import {
  JsonRpcProvider,
  Transaction,
  TransactionResponse,
  TransactionReceipt,
  BrowserProvider,
  Signer,
} from "ethers";

import apolloClient from "../apollo/client";
import { Actions } from "../types";
import { SaveTransaction } from "../queries";

function* sendTransaction(action: any) {
  const { payload } = action;

  const walletProvider = new BrowserProvider(window.ethereum);
  const signer: Signer = yield walletProvider.getSigner();

  const transaction = {
    to: payload.recipient,
    value: payload.amount,
  };

  try {
    const txResponse: TransactionResponse =
      yield signer.sendTransaction(transaction);
    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || "0",
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || "0",
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || "",
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || "123456",
        hash: receipt.hash,
      },
    };

    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });

    // yield window.location.replace(`/transaction/${variables.transaction.hash}`);
    yield put({ type: Actions.SendTransactionSuccess, payload: variables.transaction.hash })
  } catch (error: any) {
    yield put({ type: Actions.SendTransactionError, payload: error.message });
    console.error('Error occurred during transaction processing:', error);
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}
