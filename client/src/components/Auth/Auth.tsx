import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo-hooks'
import { Link, withRouter } from 'react-router-dom'

import "../styles/Form.css"
import { SIGNUP_MUTATION, LOGIN_MUTATION } from '../../graphql/mutation'
import { AUTH_TOKEN, AUTH_ID, AUTH_DELAY } from '../../constants';
import GoogleAuth from './GoogleAuth'
import SpinnerWhite from '../../util/SpinnerWhite'
import Context from '../../store/context'

const Auth: React.FunctionComponent = ({ history }: any) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repassword, setRepassword] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [loginStatus, setLoginStatus] = useState<boolean>(false)
    const passwordError = password !== repassword ? "Password does not match!" : null
    const { dispatch } = useContext<any>(Context)

    const variables = loginStatus ? { firstName, lastName, email, password } : { email, password }
    const authenticate = useMutation(loginStatus ? SIGNUP_MUTATION : LOGIN_MUTATION, { variables })

    const signupToggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        setLoginStatus(state => !state)
    }

    const onSubmitHandler = async (authenticate: any, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let authResults;
        try {
            authResults = await authenticate()
            console.log("authResults", authResults)
            if(!authResults.data.login.token) {
                dispatch({ type: AUTH_DELAY, payload: true })
               
            }
            window.localStorage.setItem(AUTH_TOKEN, loginStatus ? authResults.data.createUser.token : authResults.data.login.token)
            window.localStorage.setItem(AUTH_ID, loginStatus ? authResults.data.createUser.user.id : authResults.data.login.user.id)
            // window.localStorage.setItem(PERMISSIONS, authResults.data.user.permissions)
            history.push('/main')
        } catch(err) {
            throw new Error(err)
        }
    }

    return (
        <form 
            className={`form ${loginStatus && "form-height"}`}
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => onSubmitHandler(authenticate, e)}
        >
            <div>
                <label htmlFor='email'>
                        <input 
                            type='email' 
                            id='email'
                            value={email}
                            placeholder="email"
                            onChange={e => { setEmail(e.target.value) }}               
                        />
                </label>
            </div>
            <div>
                <label htmlFor='password'>
                    <input 
                        type='password' 
                        id='password'
                        value={password}
                        placeholder="password"
                        onChange={e => { setPassword(e.target.value) }}               
                    />
                </label>
            </div>
            { !loginStatus && 
                <Link to="/requestreset" className="password-reset">Reset Your Password</Link>
            }
            {loginStatus && 
                <>
                <label htmlFor='repassword'>
                    <input 
                        type='password' 
                        id='repassword'
                        value={repassword}
                        placeholder="confirm your password"
                        onChange={e => { setRepassword(e.target.value) }}               
                    />
                </label>
                {passwordError && 
                    <div className="error">
                        <p>
                            <strong>Oops!</strong>
                            {passwordError}
                        </p>
                    </div>
                }
                <label htmlFor='firstname'>
                    <input 
                        type='text' 
                        id='firstName'
                        value={firstName}
                        placeholder="first name"
                        onChange={e => { setFirstName(e.target.value) }}               
                    />
                </label>
                <label htmlFor='lastName'>
                    <input 
                        type='text' 
                        id='lastName'
                        value={lastName}
                        placeholder="Last Name"
                        onChange={e => { setLastName(e.target.value) }}               
                    />
                </label>
                </>
            }
            <button className="signin">
                {loginStatus ? "Signup" : "Login" }
            </button>
            <button 
                className="signupToggle"
                onClick={signupToggle}
            >
                {loginStatus ? "Back to Login" : "Create an Account"}
            </button>
        {!loginStatus && <GoogleAuth /> }
        </form>
    )
}

Auth.propTypes = {
    history: PropTypes.object.isRequired,
}

export default withRouter(Auth)
