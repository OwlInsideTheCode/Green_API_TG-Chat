import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './LoginForm.jsx'

function App() {
  const [instanceId, setInstanceId] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [phone, setPhone] = useState('')
  const [activePhone, setActivePhone] = useState('')
  const [messages, setMessages] = useState('')
  const [chatMessages, setChatMessages] = useState([])

  async function handleSubmit(event) {
    event.preventDefault()

    const url = `https://4100.api.green-api.com/waInstance${instanceId}/getStateInstance/${apiToken}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.stateInstance === 'authorized') {
      setIsConnected(true)
    }
  }

  function openChat() {
    if (phone.trim() === '') {
      return
    }

    setActivePhone(phone.trim())
  }

  async function sendMessage() {
    if (messages.trim() === '') {
      return
    }

    const url = `https://4100.api.green-api.com/waInstance${instanceId}/sendMessage/${apiToken}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: `${activePhone}@c.us`,
        message: messages
      })
    })

    if (!response.ok) {
      console.log('Failed to send:', response.status)
      return
    }

    const data = await response.json()
    console.log('Message accepted:', data.idMessage)

    const newMessage = {
      id: data.idMessage,
      text: messages,
      phone: activePhone
    }

    setChatMessages(function (prevMessages) {
      return [...prevMessages, newMessage]
    })

    setMessages('')
  }

  async function receiveMessages() {
    const url = `https://4100.api.green-api.com/waInstance${instanceId}/receiveNotification/${apiToken}`
    const response = await fetch(url)

    if (!response.ok) {
      console.log('Failed to receive:', response.status)
      return
    }

    const data = await response.json()

    if (!data) {
      return
    }

    console.log('Received:', data)

  }

  async function deleteNotification(receiptId) { // ? docs 
    const url = `https://4100.api.green-api.com/waInstance${instanceId}/deleteNotification/${apiToken}/${receiptId}`
    
    const repsonse = await fetch(url, {
      method: 'DELETE'
    })

    if (!repsonse.ok) {
      throw new Error(`Failed to delete notification: ${repsonse.status}`)
    }

  const messageElements = chatMessages
    .filter(function (message) {
      return message.phone === activePhone
    })
    .map(function (message) {
      return <p key={message.id}>{message.text}</p>
    })

  let chatContent = null

  if (activePhone !== '') {
    chatContent = (
      <div>
        <p>Chat with: {activePhone}</p>

        <div>{messageElements}</div>

        <input
          placeholder="Type your message"
          value={messages}
          onChange={function (event) {
            setMessages(event.target.value)
          }}
        />

        <button type="button" onClick={sendMessage}>
          Send
        </button>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div>
        <h1>Your chats</h1>

        <input
          type="tel"
          placeholder="Phone number with country code"
          value={phone}
          onChange={function (event) {
            setPhone(event.target.value)
          }}
        />

        <button type="button" onClick={openChat}>
          Open Chat
        </button>

        <div>{chatContent}</div>
      </div>
    )
  }

  return (
    <LoginForm
      handleSubmit={handleSubmit}
      instanceId={instanceId}
      setInstanceId={setInstanceId}
      apiToken={apiToken}
      setApiToken={setApiToken}
    />
  )
}

export default App
