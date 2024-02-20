import { Actions } from "../types";

// Define the state type
export interface RootState {
  transactions: any[];
  error: any;
  transactionId: any,
}

// Initial state
const initialState: RootState = {
  transactions: [],
  error: null,
  transactionId: null,
};

const reducer = (state = initialState, action: any): RootState => {
  switch (action.type) {
    case Actions.SendTransactionError:
      return { ...state, error: action.payload };
    case Actions.SendTransactionSuccess:
      return { ...state, transactionId: action.payload };
    default:
      return state;
  }
};

export default reducer;
