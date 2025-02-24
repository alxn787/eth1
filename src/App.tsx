import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import './App.css'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
 
const queryclient = new QueryClient()
const client = createPublicClient({ 
  chain: mainnet, 
  transport: http(), 
}) 

async function getBalance() {
  console.log('hello')
  const balance = await client.getBalance({
    address: '0x0f4e3b1f7e60c0e0c2a6a1b5f8d9f5a4b9e6f2c1',
  })
  console.log(balance.toString())
  return balance

}
function Todos() {
  const query = useQuery({ queryKey: ['balance'], queryFn: getBalance, refetchInterval : 5 * 1000 })

  return (
    <div>
      {query.data}
    </div>
  )
}
function App() {
  return (
    <QueryClientProvider client={queryclient}>
       <div> 
        <Todos/>
      </div>
    </QueryClientProvider>
  )
}
export default App
