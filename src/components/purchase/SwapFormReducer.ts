import { SwapFormState } from 'widgets/src/interfaces'

export const SwapFormReducer = (
  state: SwapFormState,
  action,
): SwapFormState => {
  switch (action.type) {
    case 'batchChange':
      return { ...state, ...action.payload }

    case 'fieldChanged':
      return {
        ...state,
        [action.field]: action.payload,
      }
    case 'fromAddressChange':
      const { fromAddress, fromName } = action.payload
      return {
        ...state,
        fromAddress,
        fromName,
      }
    default:
      throw new Error()
  }
}
