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
  )
}

  return (
    <div className="chat">
      <h1>Your chats</h1>

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
        <div>{chatContent}</div>
    </div>
  )
}

export default Chat