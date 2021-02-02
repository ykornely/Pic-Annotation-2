import { useState } from 'react'
import { login } from '../api'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import joi from 'joi'

const Login = () => {
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        
        try {
            joi.assert(email, joi.string().email({ tlds: { allow: false } }))
        } catch (error) {
            setError('invalid-email')
        }

        try {
            joi.assert(password, joi.string().min(4))
        } catch (error) {
            setError('min-4-char')
        }

        try {
            const { token } = await login({ email, password })
            localStorage.setItem('token', token)
            history.push('/pictures')
        } catch (error) {
            console.error(error)
         }

    }

    return (
        <div className="wrapper">
            <div id="formContent">
            <Link to="/login">
                <h2 className="active">Sign In</h2>
            </Link>
            <Link to="/signup">
                <h2 className="underlineHover">Sign Up</h2>
            </Link>
                <div>
                    <img src="/img/single_user.png" id="icon" alt="User Icon" />
                </div>
                <form id="signInForm" onSubmit={handleSubmit}>
                    <input id="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('')}} type="text" name="email" placeholder="Email" />
                    <div>{error === 'invalid-email' && <label className="validation-message">Invalid email address.</label>}</div>
                    <input id="password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} type="password" name="password" placeholder="Password" required />
                    <div>{error === 'min-4-char' && <label className="validation-message">Minimum 4 characters.</label>}</div>
                    <input type="submit" value="Sign In" />
                </form>
            </div>
        </div>
    )
}

export default Login
