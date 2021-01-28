import { useState } from 'react'
import { login, signup } from '../api'
import { useHistory } from 'react-router-dom'

const Signup = () => {
    const history = useHistory()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        await signup({ fullName, email, password })
        const { token } = await login({ email, password })

        localStorage.setItem('token', token)

        history.push('/pictures')
    }

    return (
        <div className="wrapper">
            <div id="formContent">
                <div>
                    <img src="/img/users.png" id="icon" alt="User Icon" />
                </div>
                <form id="signUpForm" onSubmit={handleSubmit}>
                    <input type="text" id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} name="fullName" placeholder="Full Name" required />
                    <div>{error === 'full-name-required' && <label className="validation-message">This field is required.</label>}</div>
                    <input type="text" id="email" value={email} onChange={(event) => setEmail(event.target.value)} name="email" placeholder="Email" required />
                    <div>
                        {error === 'email-required' && <label className="validation-message">This field is required.</label>}
                        {error === 'invalid-email' && <label className="validation-message">Invalid email address.</label>}
                    </div>
                    <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} name="password" placeholder="Password" required />
                    <div>
                        {error === 'password-required' && <label className="validation-message">This field is required.</label>}
                        {error === 'min-4-char' && <label className="validation-message">Enter atleast 4 characters.</label>}
                    </div>
                    <input type="submit" value="Sign Up" />
                </form>
            </div>
        </div>
    )
}
export default Signup
