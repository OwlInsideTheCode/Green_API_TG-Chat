function Chat(props) {
  const messageElements = props.chatMessages
    .filter(function (message) {
      return message.phone === props.activePhone
    })
    .map(function (message) {
      const sender = message.direction === 'incoming' ? 'Contact' : 'You'

      return (
        <p key={message.id} className={message.direction}>
          <strong>{sender}: </strong>
          <span>{message.text}</span>
        </p>
      )
    })

  let chatContent = null

  if (props.activePhone !== '') {
    chatContent = (
      <div>
        <p>Chat with: {props.activePhone}</p>

        <div className="message-list">{messageElements}</div>

        <div className="message-compose">
          <input
            placeholder="Type your message"
            value={props.messages}
            onChange={function (event) {
              props.setMessages(event.target.value)
            }}
          />

          <button type="button" onClick={props.sendMessage}>
            Send
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="chat">
      <h1>Your chats</h1>

      <div className="chat-controls">
        <input
          type="tel"
          placeholder="Phone number with country code"
          value={props.phone}
          onChange={function (event) {
            props.setPhone(event.target.value)
          }}
        />

        <button type="button" onClick={props.openChat}>
          Open Chat
        </button>
      </div>

      <div>{chatContent}</div>
    </div>
  )
}

export default Chat