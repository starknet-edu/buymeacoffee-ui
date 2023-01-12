import { useEffect, useState } from 'react'
import { useStarknetCall, useAccount } from '@starknet-react/core'
import { useStarknetContract } from './useContract'
import addresses from '../config/constants'
import ETH_ABI from '../config/abis/ERC20_abi.json'
import { uint256 } from 'starknet'

const useAllowance = () => {
  const [allowance, setAllowance] = useState(false)
  const ethContract = useStarknetContract(addresses.eth, ETH_ABI)
  const { address } = useAccount()
  const { data, loading } = useStarknetCall({
    contract: ethContract,
    method: 'allowance',
    args: [address, addresses.buyMeACoffee],
    options: {
      watch: true,
    },
  })
  const remaining = data && uint256.uint256ToBN(data[0])
  useEffect(() => {
    if (Number(remaining) > 10000 && !loading) {
      setAllowance(true)
    } else {
      setAllowance(false)
    }
  }, [address, remaining, loading])

  return allowance
}

export default useAllowance
