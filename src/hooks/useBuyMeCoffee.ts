import { useMemo } from 'react'
import { useStarknetExecute } from '@starknet-react/core'
import { stringToFelt, getTokenAmount, chunkSubstr } from '../utils/helpers'
import addresses from '../config/constants'
import BigNumber from 'bignumber.js'

const useBuyMeCoffee = (name: string, messages: string, amount: string) => {
  const constructCalls = (name: string, messages: string, amount: string) => {
    const feltName = stringToFelt(name)
    const messageArray = chunkSubstr(messages, 30)
    const chosenAmount = getTokenAmount(BigNumber(amount))

    const calldata_approve = [
      addresses.buyMeACoffee,
      chosenAmount.low,
      chosenAmount.high,
    ]

    const tx_approve = {
      contractAddress: addresses.eth,
      entrypoint: 'approve',
      calldata: calldata_approve,
    }

    const calldata_transfer = [feltName, messageArray.length]
      .concat(messageArray)
      .concat(chosenAmount.low, chosenAmount.high)

    const tx_transfer = {
      contractAddress: addresses.buyMeACoffee,
      entrypoint: 'buy_me_a_coffee',
      calldata: calldata_transfer,
    }

    return [tx_approve, tx_transfer]
  }

  const calls = useMemo(
    () => constructCalls(name, messages, amount),
    [name, messages, amount],
  )

  const {
    data: buyMeCoffeeData,
    execute: buyMeCoffee,
    error,
  } = useStarknetExecute({ calls })
  return { buyMeCoffeeData, buyMeCoffee, error }
}

export default useBuyMeCoffee
