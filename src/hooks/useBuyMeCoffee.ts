import { useMemo } from 'react'
import { useStarknetExecute } from '@starknet-react/core'
import { stringToFelt, getTokenAmount, chunkSubstr } from '../utils/helpers'
import addresses from '../config/constants'
import BigNumber from 'bignumber.js'

const useBuyMeCoffee = (name: string, messages: string, amount: string) => {
  const feltName = stringToFelt(name)
  const messageArray = chunkSubstr(messages, 30)
  const chosenAmount = getTokenAmount(BigNumber(amount))
  const calldata = [feltName, messageArray.length]
    .concat(messageArray)
    .concat(chosenAmount.low, chosenAmount.high)

  const calls = useMemo(() => {
    const tx = {
      contractAddress: addresses.buyMeACoffee,
      entrypoint: 'buy_me_a_coffee',
      calldata,
    }
    return tx
  }, [calldata])

  const {
    data: buyMeCoffeeData,
    execute: buyMeCoffee,
    error,
  } = useStarknetExecute({ calls })
  return { buyMeCoffeeData, buyMeCoffee, error }
}

export default useBuyMeCoffee
