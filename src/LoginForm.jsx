
function LoginForm(props) {
    return (
        <form className="login-form" onSubmit = {props.handleSubmit}>
            <h1> Telegram Chat</h1>

            <input 
                name = "instanceId"
                placeholder = "Instance ID"
                value = {props.instanceId}
                onChange = {function (event) {
                    props.setInstanceId(event.target.value)
                }}
            />

            <input
                name = "apiToken"
                placeholder = "API token"
                type = "password"
                value = {props.apiToken}
                onChange = {function (event) {
                    props.setApiToken(event.target.value)
                }}
            />  

            <button type = "submit">Connect</button>   
        </form>
    )
}

export default LoginForm