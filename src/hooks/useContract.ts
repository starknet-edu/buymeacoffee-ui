import { useContract } from '@starknet-react/core'

export const useStarknetContract = (address: string, abi: any) => {
  const { contract } = useContract({
    abi,
    address,
  })

  return contract
}
