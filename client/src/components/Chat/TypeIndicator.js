import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo-hooks'
import { CREATE_MESSAGE_MUTATION } from '../../graphql/mutation'

const TypeIndicator = ({ keycode, myUsername, channel, chatterId }) => {
    const isTyping = useTypeIndicator(keycode)
    const createMessage = useMutation(CREATE_MESSAGE_MUTATION, {
        variables: {
            text: `${myUsername} is typing...`,
            chatterId,
            channel,
            isTyping: true,
        }
    })

    useEffect(() => {
        if(isTyping) {
            try {
                createMessage()
            } catch(err) {
                throw new Error(err)
            }
        } else {
            return
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ isTyping ])

    return true
}

const useTypeIndicator = keycode => {
    const [isTyping, setIsTyping] = useState(false)
    useEffect(() => {
        if(keycode !== 13) {
            setIsTyping(true)
        } else {
            setIsTyping(false)
        }
    }, [keycode])
    return isTyping
}

TypeIndicator.propTypes = {
    keycode: PropTypes.number.isRequired,
    myUserName: PropTypes.string,
    channel: PropTypes.string.isRequired,
    chatterId: PropTypes.string.isRequired,
}

export default React.memo(TypeIndicator)

