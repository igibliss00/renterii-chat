<<<<<<< HEAD
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo-hooks'
import { Link, withRouter } from 'react-router-dom'

import "../styles/Form.css"
import { SIGNUP_MUTATION, LOGIN_MUTATION } from '../../graphql/mutation'
import { AUTH_TOKEN, AUTH_ID } from '../../constants';
import GoogleAuth from './GoogleAuth'

const Auth: React.FunctionComponent = ({ history }: any) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repassword, setRepassword] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [loginStatus, setLoginStatus] = useState<boolean>(false)
    const passwordError = password !== repassword ? "Password does not match!" : null

    const variables = loginStatus ? { firstName, lastName, email, password } : { email, password }
    const authenticate = useMutation(loginStatus ? SIGNUP_MUTATION : LOGIN_MUTATION, { variables })

    const signupToggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        setLoginStatus(state => !state)
    }

    const onSubmitHandler = async (authenticate: any, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let authResults;
=======
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'

import { SIGNUP_MUTATION, LOGIN_MUTATION, CLOSE_AUTH_MODAL_MUTATION, OPEN_CART_MUTATION } from '../../graphql/mutation'
import { AUTH_TOKEN, AUTH_ID } from '../../constants';
import '../styles/form.css'
import Error from '../../util/ErrorMessage'
import GoogleAuth from './GoogleAuth'

const Auth = ({ history, match, path }: { history: any, match: any, path: string }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [loginStatus, setLoginStatus] = useState()
    const [error, setError] = useState({})
    const variables = loginStatus ? { firstName, lastName, email, password } : { email, password }
    const authenticate = useMutation(loginStatus ? SIGNUP_MUTATION : LOGIN_MUTATION, { variables })

    // close the auth modal when authenticated through Post Detail login, not through Nav login
    const closeAuthModal = useMutation(CLOSE_AUTH_MODAL_MUTATION) 
    const openCart = useMutation(OPEN_CART_MUTATION)        
    const closeModal = () => {
        closeAuthModal()
        window.location.reload()
        window.setTimeout(() => {
            openCart()
        }, 5000);   
    }

    const onSubmitHandler = async (authenticate: any, e: any) => {
        e.preventDefault()
        let authResults
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
        try {
            authResults = await authenticate()
            if(authResults) {
                window.localStorage.setItem(AUTH_TOKEN, loginStatus ? authResults.data.createUser.token : authResults.data.login.token)
                window.localStorage.setItem(AUTH_ID, loginStatus ? authResults.data.createUser.user.id : authResults.data.login.user.id)
                // window.localStorage.setItem(PERMISSIONS, authResults.data.user.permissions)
<<<<<<< HEAD
                history.push('/main')
            }
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
=======
                history ? history.push('/') : closeModal()
                // const permissions = window.localStorage.getItem(PERMISSIONS)
            }
        } catch(error) {
            setError(error)
        }

    }
    // determine the path of how it took to get to Auth and provide either signup or login 
    let paths: string;
    if(match){
        paths = match.path
    }
    // const { path } = match && match
    useEffect(() => {
        if (paths ==='/signup' || path === '/signup'){
            setLoginStatus(true)
        } else {
        setLoginStatus(false)
        }
    // @ts-ignore
    }, [ paths, path ])
    const passwordError = password !== repassword ? "Password does not match!" : null
    return (
        <>
        <form 
            className='form'
            onSubmit={e => onSubmitHandler(authenticate, e)
        }>
            <h2>{loginStatus ? "Sign Up" : "Sign In"}</h2>
            <Error error={error} />
            <fieldset>
                <label htmlFor='email'>
                        <p>Email</p>
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
                        <input 
                            type='email' 
                            id='email'
                            value={email}
<<<<<<< HEAD
                            placeholder="email"
                            onChange={e => { setEmail(e.target.value) }}               
                        />
                </label>
            </div>
            <div>
                <label htmlFor='password'>
=======
                            onChange={e => { setEmail(e.target.value) }}               
                        />
                </label>
                <label htmlFor='password'>
                    <p>Password</p>
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
                    <input 
                        type='password' 
                        id='password'
                        value={password}
<<<<<<< HEAD
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
=======
                        onChange={e => { setPassword(e.target.value) }}               
                    />
                </label>
                { !loginStatus && 
                <>
                    <Link to="/requestreset" className="reset">Reset Your Password</Link>
                </>
                }
                {loginStatus && 
                    <>
                    <label htmlFor='repassword'>
                        <p>Confirm Your Password</p>
                        <input 
                            type='password' 
                            id='repassword'
                            value={repassword}
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
                        <p>First Name</p>
                        <input 
                            type='text' 
                            id='firstName'
                            value={firstName}
                            onChange={e => { setFirstName(e.target.value) }}               
                        />
                    </label>
                    <label htmlFor='lastName'>
                        <p>Last Name</p>
                        <input 
                            type='text' 
                            id='lastName'
                            value={lastName}
                            onChange={e => { setLastName(e.target.value) }}               
                        />
                    </label>
                    </>
                }
                <button>
                    { loginStatus ? "Signup" : "Login" }
                </button>
            </fieldset>
        </form>   
        <GoogleAuth />
        </>
    )
}

Auth.propsTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
}

export default React.memo(Auth)

           
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
