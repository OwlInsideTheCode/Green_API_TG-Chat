import { useState } from 'react'
import './App.css'

function App() {
  const [instanceId, setInstanceId] = useState('')
  const [apiToken, setApiToken] = useState('')
  
  async function handleSubmit(event) {
    event.preventDefault()

    const url = `https://4100.api.green-api.com/waInstance${instanceId}/getStateInstance/${apiToken}`
    const response = await fetch(url)
    const data = await response.json()

    console.log(data.stateInstance)
  }

  return (
      <form onSubmit={handleSubmit}>
        <h1>Telegram Chat</h1>
        <input 
          name="instanceId" 
          placeholder="Instance ID" 
          value={instanceId} 
          onChange={function (event) {
            setInstanceId(event.target.value)
          }}
        />
        <input 
          name="apiToken" 
          placeholder="API token" 
          type="password" 
          value={apiToken} 
           onChange={function (event) {
            setApiToken(event.target.value)
          }} 
        />
        <button>Connect</button>
      </form>
  )
}

export default App
