import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useTrail, animated } from 'react-spring'

import ChatMembers from './ChatMembers'
import TextPreview from './TextPreview'
import '../styles/ChannelList.css'
import Context from '../../store/context'
import { SELECT_CHANNEL } from '../../constants';

const ChannelList = ({ channels, subscribeToNewChannel }) => {
    const [clicked, setClicked] = useState()
    useEffect(() => {
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

    const { dispatch } = useContext(Context)
    const chatSelectHandler = (id, members, index) => {
        const chatInfo = { channel: id, members }
        dispatch({ type: SELECT_CHANNEL,  payload: chatInfo })
        setClicked(index)
    }

    const channelList = trail.map((props, index) => {
        const { id, members, updatedAt } = channels[index]
        return (
            <animated.div
                key={id}
                style={props}
            >
                <div 
                    onClick={() => chatSelectHandler(id, members, index)}
                    className="channel-list-wrapper"
                >
                    <li className={`channel-list ${clicked === index ? "channel-highlighted": ''}`}>
                        <img src="https://source.unsplash.com/user/erondu" alt=""/>
                        <div className="channel-list-main">
                            <p className="member">
                                <ChatMembers channel={channels[index]} />
                            </p>
                            <p>
                                <TextPreview channel={channels[index]} />
                            </p>
                        </div>
                        <p className="last-chat-date">
                            {moment(updatedAt).format("MMM-DD-YY")}
                        </p>
                    </li>
                </div>
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

// to={{ pathname: `/chat/${id}`, state: { channel: id, members }}}
