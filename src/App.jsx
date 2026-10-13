
import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './LoginForm.jsx'
import Chat from './Chat.jsx'

function App() {
  const [instanceId, setInstanceId] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [phone, setPhone] = useState('')
  const [activePhone, setActivePhone] = useState('')
  const [messages, setMessages] = useState('')
  const [loginError, setLoginError] = useState('')
  // const [chatMessages, setChatMessages] = useState([])
  const [chatMessages, setChatMessages] = useState([
  {
    id: 1,
    text: "Hey! What's up?",
    phone: '1234567890',
    direction: 'incoming'
  },
  {
    id: 2,
    text: "Just chilling. You?",
    phone: '1234567890',
    direction: 'outgoing'
  }
])
  const devMode = true // заменить на False для отключения режима разработчика

  async function handleSubmit(event) {
  event.preventDefault()
  setLoginError('')

  if (!instanceId.trim() || !apiToken.trim()) {
    setLoginError('Enter your instance ID and API token.')
    return
  }

  try {
    const url = `https://4100.api.green-api.com/waInstance${instanceId.trim()}/getStateInstance/${apiToken.trim()}`
    const response = await fetch(url)

    if (!response.ok) {
      setLoginError(`Connection failed: HTTP ${response.status}`)
      return
    }

    const data = await response.json()

    if (data.stateInstance === 'authorized') {
      setIsConnected(true)
    } else {
      setLoginError(`Instance is not ready. Status: ${data.stateInstance}`)
    }
  } catch {
    setLoginError('Unable to connect. Check your internet connection and API availability.')
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
      phone: activePhone,
      direction: 'outgoing'
    }

    setChatMessages(function (prevMessages) {
      return [...prevMessages, newMessage]
    })

    setMessages('')
  }

  useEffect(function () {
    if (!isConnected) {
      return
    }

    let stopped = false
    let timeoutId

    async function receiveMessages() {
      const url = `https://4100.api.green-api.com/waInstance${instanceId}/receiveNotification/${apiToken}`
      const response = await fetch(url)

      if (!response.ok) {
        console.log('Failed to receive:', response.status)
        return
      }

      const data = await response.json()

      if (!data || stopped) {
        return
      }

      const notification = data.body

if (
  notification.typeWebhook === 'incomingMessageReceived' &&
  notification.messageData.typeMessage === 'textMessage' &&
  notification.senderData.chatType === 'user' &&
  notification.senderData.senderPhoneNumber
) {
  const newMessage = {
    id: notification.idMessage,
    text: notification.messageData.textMessageData.textMessage,
    phone: String(notification.senderData.senderPhoneNumber),
    direction: 'incoming'
  }

  setChatMessages(function (prevMessages) {
    const alreadyExists = prevMessages.some(function (message) {
      return message.id === newMessage.id &&
        message.phone === newMessage.phone
    })

    if (alreadyExists) {
      return prevMessages
    }

    return [...prevMessages, newMessage]
  })
}

await deleteNotification(data.receiptId)
    }

    async function deleteNotification(receiptId) { // ? docs 
      const url = `https://4100.api.green-api.com/waInstance${instanceId}/deleteNotification/${apiToken}/${receiptId}`

      const response = await fetch(url, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.status}`)
      }
    }

    async function checkMessages() {
      try {
        await receiveMessages()
      } catch (error) {
        console.error('Failed:', error)
      }

      if (!stopped) {
        timeoutId = setTimeout(checkMessages, 5000)
      }
    }

    timeoutId = setTimeout(checkMessages, 0)

    return function () {
      stopped = true
      clearTimeout(timeoutId)
    }
  }, [isConnected, instanceId, apiToken]) // ?

  return (
    <div className="app">
      {!isConnected && !devMode ? (
        <LoginForm
          instanceId={instanceId}
          apiToken={apiToken}
          setInstanceId={setInstanceId}
          setApiToken={setApiToken}
          handleSubmit={handleSubmit}
        />
      ) : (
        <Chat
          phone={phone}
          setPhone={setPhone}
          activePhone={activePhone}
          openChat={openChat}
          messages={messages}
          setMessages={setMessages}
          chatMessages={chatMessages}
          sendMessage={sendMessage}
        />
      )}
    </div>
  )
}

export default App

