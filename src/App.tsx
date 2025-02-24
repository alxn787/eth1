import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { 
  http, createConfig, WagmiProvider, useConnect, useAccount, useBalance, useSendTransaction 
} from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { parseEther, isAddress } from 'viem'

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})

function EthSend() {
  const { data: hash, sendTransaction, isPending } = useSendTransaction();

  function sendEth() {
    const to = (document.getElementById("address") as HTMLInputElement).value.trim();
    const value = (document.getElementById("value") as HTMLInputElement).value.trim();

    if (!isAddress(to)) {
      alert("Invalid Ethereum address!");
      return;
    }

    if (!value || isNaN(Number(value))) {
      alert("Invalid amount!");
      return;
    }

    sendTransaction({ 
      to, 
      value: parseEther(value)
    });
  }  

  return (
    <div>
      <input id="address" type="text" placeholder="Enter address" />
      <input id="value" type="text" placeholder="Enter amount" />
      <button onClick={sendEth} disabled={isPending}>
        {isPending ? "Sending..." : "Send ETH"}
      </button>
      {hash}
    </div>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletConnector />
        <EthSend />
        <MyAddress />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function MyAddress() {
  const { address } = useAccount();
  const balance = useBalance({ address });

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance?.data?.formatted} ETH</p>
    </div>
  );
}

function WalletConnector() {
  const { connect, connectors } = useConnect();

  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
          Connect with {connector.name}
        </button>
      ))}
    </div>
  );
}

export default App;
