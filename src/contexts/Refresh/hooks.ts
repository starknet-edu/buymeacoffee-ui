import { useContext } from 'react'
import { RefreshContext } from './context'

export const useRefresh = () => {
  const { fast, slow } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow }
}
