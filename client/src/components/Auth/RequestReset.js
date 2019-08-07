import React, { useState } from 'react'
import { useMutation } from 'react-apollo-hooks'

import '../styles/form.css'
import { REQUEST_RESET_MUTATION } from '../../graphql/mutation'
import Error from '../../util/ErrorMessage'

const RequestReset = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState({})
    const variables = { email }
    const reset = useMutation(REQUEST_RESET_MUTATION, { variables })

    const onSubmitHandler = async e => {
        e.preventDefault()
        let resetRequest
        try {
            resetRequest = await reset()
            setMessage(resetRequest.data.requestReset)
        } catch (err) {
            setMessage(err)
        }
    }
    return (
        <form 
            className='form'
            method="post"
            onSubmit={onSubmitHandler}
        >
            <h2>Request a password reset</h2>
            <Error error={message} />
            <fieldset>
                <label htmlFor='email'>
                    <p>Email</p>
                    <input 
                        type='email' 
                        id='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}               
                    />
                </label>
                <button>Request!</button>
            </fieldset>
        </form>
    )
}

export default React.memo(RequestReset)