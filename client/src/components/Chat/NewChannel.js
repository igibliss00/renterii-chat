import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo-hooks'

import Chat from './Chat'
import { CREATE_CHANNEL_MUTATION } from '../../graphql/mutation'

const NewChannel = props => {
    // lenderId
    const { id } = !!props.match.params && props.match.params
    const createChannel = useMutation(CREATE_CHANNEL_MUTATION)
    const [channel, setChannel] = useState('')
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await createChannel({ variables: { id } })
                setChannel(response)
            } catch(err) {
                throw new Error(err)
            }
        }
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    if(channel) {
        return (
            <Chat 
                lenderId={id} 
                members={channel.data.createChannel.members}
                channel={channel.data && channel.data.createChannel.id}
            />
        )
    } 
    return null
}

NewChannel.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    })
}

export default React.memo(NewChannel)