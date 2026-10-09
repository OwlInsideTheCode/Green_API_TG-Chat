import { useState } from 'react'
import './App.css'

function App() {
  const [instanceId, setInstanceId] = useState('')
  const [apiToken, setApiToken] = useState('')
  
  function handleSubmit(event) {
    event.preventDefault()
    console.log('Instance ID:', instanceId)
    console.log('API Token:', apiToken !== '')
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
