import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { StarknetConfig, InjectedConnector } from '@starknet-react/core'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { AppProps } from 'next/app'
import { EventsProvider } from '../contexts/Events/EventsProvider'
import { RefreshContextProvider } from '../contexts/Refresh/context'

export const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const connectors = [
    new InjectedConnector({ options: { id: 'argentX' } }),
    new InjectedConnector({ options: { id: 'braavos' } }),
  ]

  const AnyComponent = Component as any
  return (
    <StarknetConfig connectors={connectors}>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <EventsProvider>
          <RefreshContextProvider>
            <AnyComponent {...pageProps} />
          </RefreshContextProvider>
        </EventsProvider>
      </QueryClientProvider>
    </StarknetConfig>
  )
}
