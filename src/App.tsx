import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { http, createConfig, WagmiProvider, useConnect, useAccount, useBalance } from 'wagmi'
import { base, mainnet} from 'wagmi/chains'
import { injected} from 'wagmi/connectors'


export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})

function EthSend() {
  return (
    <div> 
        <input type="text" placeholder="Address" />
          <button>Send eth</button>
    </div>
  )
}

const queryClient = new QueryClient();
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletConnector/>
        <EthSend />
        <MyAddress/>
      </QueryClientProvider>
    </WagmiProvider>
    )
}

function MyAddress(){
  const {address} = useAccount();
  const balance  = useBalance({address})
  return(
    <div>
      {address}<br></br>
      {balance?.data?.formatted}

    </div>
  )
}
function WalletConnector() {
  const { connect, connectors} = useConnect()
  return(
    <div>
      {connectors.map((connector)=>(
        <button key = {connector.uid} onClick={() => connect({connector})}>{connector.name}</button>
      ))}
    </div>
  )
}
export default App
