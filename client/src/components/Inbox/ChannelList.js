import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useTrail, animated } from 'react-spring'

import ChatMembers from './ChatMembers'
import TextPreview from './TextPreview'
import '../styles/ChannelList.css'

const ChannelList = ({ channels, subscribeToNewChannel }) => {
    useEffect(() => {
        document.title = 'renterii - inbox'
        subscribeToNewChannel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const trail = useTrail(channels.length, {
        config: { duration: 1000 },
        from: {
            marginTop: -20,
            opacity: 0
        },
        to: {
            marginTop: 20,
            opacity: 1
        }
    })
    const channelList = trail.map((props, index) => {
        const { id, members, updatedAt } = channels[index]
        return (
            <animated.div
                key={id}
                style={props}
            >
            <Link
                to={{ pathname: `/chat/${id}`, state: { channel: id, members }}}
            >
                <li className="channel-list"
                >
                    <p className="member">
                        <ChatMembers channel={channels[index]} />
                    </p>
                    <p>
                        <TextPreview channel={channels[index]} />
                    </p>
                    <p>
                        <small>{moment(updatedAt).format("MMM-DD-YYYY")}</small>
                    </p>
                </li>
            </Link>
            </animated.div>
        )}
    )

    return channelList 
}

ChannelList.propTypes = {
    channels: PropTypes.array.isRequired,
    subscribeToNewChannel: PropTypes.func.isRequired
}
  
export default React.memo(ChannelList)