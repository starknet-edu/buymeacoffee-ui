import { number, shortString, uint256 } from 'starknet'
import BigNumber from 'bignumber.js'
import axios from 'axios'

export const stringToFelt = (inputString: string) => {
  let decimal: string = ''
  if (inputString.length < 32) {
    decimal = number.toFelt(shortString.encodeShortString(inputString))
  }
  return decimal
}

export const feltToString = (inputString: string) => {
  const bigNumber = number.toBN(inputString)
  const hex = number.toHex(bigNumber)
  const text = shortString.decodeShortString(hex)
  return text
}

export const feltToHex = (inputString: string) => {
  const bigNumber = number.toBN(inputString)
  const hex = number.toHex(bigNumber)
  return hex
}

export const getTokenAmount = (balance: BigNumber, decimals = 18) => {
  const amount = balance.multipliedBy(new BigNumber(10).pow(decimals)).toFixed()
  return uint256.bnToUint256(amount)
}

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(
    new BigNumber(10).pow(decimals),
  )
  return displayBalance.toNumber()
}

export const chunkSubstr = (str: string, size: number) => {
  let chunks = []
  for (var i = 0, charsLength = str.length; i < charsLength; i += size) {
    chunks.push(stringToFelt(str.substring(i, i + size)))
  }
  return chunks
}

export const getReceipt = (events: any) => {
  if (Array.isArray(events)) {
    const receiptsData = events[2]['data']
    const accounts = receiptsData[0]
    const name = feltToString(receiptsData[1])
    const messagesLen = Number(feltToString(receiptsData[2]))
    const messagesArray = receiptsData.slice(
      receiptsData.length - messagesLen,
      receiptsData.length,
    )
    let messages = ''
    messagesArray.forEach((item: string) => (messages += feltToString(item)))
    return {
      accounts,
      name,
      messages,
    }
  }
}

export const apiVoyagerClient = axios.create({
  baseURL: 'https://goerli-2.voyager.online/api',
  timeout: 10000,
  headers: {
    accept: 'application/json',
    'Content-type': 'application/json',
    'Cache-Control': 'no-cache',
  },
})
