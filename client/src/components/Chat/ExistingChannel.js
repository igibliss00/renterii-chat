import React from 'react'
import PropTypes from 'prop-types'

import Chat from './Chat'

const ExistingChannel = props => {
    if(props.location.state.channel) {
        const { channel, members } = props.location.state
        return (
            <Chat 
                channel={channel}
                members={members}
            />
        )
    }
    return null
}

ExistingChannel.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    })
}

export default React.memo(ExistingChannel)
