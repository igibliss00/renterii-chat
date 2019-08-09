import React, { useState } from 'react'
<<<<<<< HEAD
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo-hooks'

import '../styles/Form.css'
=======
import { useMutation } from 'react-apollo-hooks'

import '../styles/form.css'
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
import { RESET_MUTATION } from '../../graphql/mutation'
import { GET_MY_INFO_SIMPLE } from '../../graphql/query'
import Error from '../../util/ErrorMessage'
import { AUTH_TOKEN, AUTH_ID } from '../../constants';

<<<<<<< HEAD
const Reset = ({ history }) => {
=======
const Reset = props => {
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState({})

    // retrieve the query string from URL
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const resetToken = params.get('resetToken');

    const reset = useMutation(RESET_MUTATION, { 
        variables: {
            resetToken,
            password,
            confirmPassword
        },
        refetchQueries: { query: GET_MY_INFO_SIMPLE }
    })

    const onHandleSubmit = async e => {
        e.preventDefault()
        let resetResult
        try {
            resetResult = await reset()
            setMessage(resetResult.data.resetPassword)
        } catch (err){
            setMessage(err)
        }
        if(resetResult) {
            await localStorage.setItem(AUTH_TOKEN, resetResult.data.resetPassword.token)
            await localStorage.setItem(AUTH_ID, resetResult.data.resetPassword.user.id)
            setTimeout(() => {
<<<<<<< HEAD
                history.push('/')
=======
                props.history.push('/')
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
            }, 1500)
        }
    }

    return (
        <form
            className="form"
            method="post"
            onSubmit={onHandleSubmit}
        >
            <h2>Reset Your Password</h2>
            <Error error={message} />
            <fieldset>    
                <label htmlFor="password">
                    <p>Password</p>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </label>

                <label htmlFor="confirmPassword">
                    <p>Confirm Your Password</p>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </label>
              <button type="submit">Reset Your Password!</button>
            </fieldset>
        </form>
    )
}

<<<<<<< HEAD
Reset.propTypes = {
    history: PropTypes.object.isRequired,
}

=======
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
export default React.memo(Reset)