import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo-hooks'

import { CREATE_CHANNEL_MUTATION } from '../../graphql/mutation'
import '../styles/CreateChannel.css'
import Chat from './Chat'
import Spinner from '../../util/Spinner'

const CreateChannel = props => {
    const channelFromList = props.location.state.channel
    const { id } = props.match.params && props.match.params
    const [channel, setChannel] = useState(channelFromList ? channelFromList : '')
    const createChannel = useMutation(CREATE_CHANNEL_MUTATION)
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
    }, [id])
    
    if(channel) {
        return (
            <Chat 
                lenderId={id} 
                channel={channel.data && channel.data.createChannel.id}
            />
        )
    }
    return <Spinner />
}

export default React.memo(CreateChannel)