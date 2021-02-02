import { useState } from 'react'
import { login, signup } from '../api'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import joi from 'joi'

const Signup = () => {
    const history = useHistory()
    const [fullName, setFullName] = useState('')
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
            await signup({ fullName, email, password })
            const { token } = await login({ email, password })
            localStorage.setItem('token', token)
            history.push('/pictures') // go to pictures (client side redirection)
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div className="wrapper">
            <div id="formContent">
                <Link to="/login">
                    <h2 className="underlineHover">Sign In</h2>
                </Link>
                <Link to="/signup">
                    <h2 className="active">Sign Up</h2>
                </Link>
                <div>
                    <img src="/img/users.png" id="icon" alt="User Icon" />
                </div>
                <form id="signUpForm" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(event) => {
                            setFullName(event.target.value)
                            setError('')
                        }}
                        name="fullName"
                        placeholder="Full Name"
                        required
                    />

                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value)
                            setError('')
                        }}
                        name="email"
                        placeholder="Email"
                        required
                    />
                    
                    <div>{error === 'invalid-email' && <label className="validation-message">Invalid email address.</label>}</div>
                    
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value)
                            setError('')
                        }}
                        name="password"
                        placeholder="Password"
                        required
                    />
                    
                    <div>{error === 'min-4-char' && <label className="validation-message">Enter atleast 4 characters.</label>}</div>
                    <input type="submit" value="Sign Up" />
                </form>
            </div>
        </div>
    )
}
export default Signup
