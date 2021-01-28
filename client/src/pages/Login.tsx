import { useState } from 'react'
import { login } from '../api'
import { useHistory } from 'react-router-dom'

const Login = () => {
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        const { token } = await login({ email, password })

        localStorage.setItem('token', token)

        history.push('/pictures')
    }

    return (
        <div className="wrapper">
            <div id="formContent">
                <div>
                    <img src="/img/single_user.png" id="icon" alt="User Icon" />
                </div>
                <form id="signInForm" onSubmit={handleSubmit}>
                    <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="text" name="email" placeholder="Email" />
                    <div>{error === 'invalid-email' && <label className="validation-message">Invalid email address.</label>}</div>
                    <input id="password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" name="password" placeholder="Password" required />
                    <div>{error === 'min-4-char' && <label className="validation-message">Minimum 4 characters.</label>}</div>
                    <input type="submit" value="Sign In" />
                </form>
                {error !== '' && <div className="alert"></div>}
            </div>
        </div>
    )
}

export default Login
