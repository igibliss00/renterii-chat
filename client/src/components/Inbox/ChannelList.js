<<<<<<< HEAD
import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
=======
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
import { useTrail, animated } from 'react-spring'

import ChatMembers from './ChatMembers'
import TextPreview from './TextPreview'
import '../styles/ChannelList.css'
<<<<<<< HEAD
import Context from '../../store/context'
import { SELECT_CHANNEL } from '../../constants';

const ChannelList = ({ channels, subscribeToNewChannel }) => {
    const [clicked, setClicked] = useState(false)
    useEffect(() => {
=======

const ChannelList = ({ channels, subscribeToNewChannel }) => {
    useEffect(() => {
        document.title = 'renterii - inbox'
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
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
<<<<<<< HEAD

    const { dispatch } = useContext(Context)
    const chatSelectHandler = (id, members) => {
        const chatInfo = { channel: id, members }
        dispatch({ type: SELECT_CHANNEL,  payload: chatInfo })
        setClicked(state => !state)
    }

=======
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
    const channelList = trail.map((props, index) => {
        const { id, members, updatedAt } = channels[index]
        return (
            <animated.div
                key={id}
                style={props}
            >
<<<<<<< HEAD
                <div 
                    onClick={() => chatSelectHandler(id, members)}
                    className="channel-list-wrapper"
                >
                    <li className={`channel-list ${clicked && "channel-highlighted"}`}>
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
=======
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
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
            </animated.div>
        )}
    )

    return channelList 
}

ChannelList.propTypes = {
    channels: PropTypes.array.isRequired,
    subscribeToNewChannel: PropTypes.func.isRequired
}
  
<<<<<<< HEAD
export default React.memo(ChannelList)

// to={{ pathname: `/chat/${id}`, state: { channel: id, members }}}
=======
export default React.memo(ChannelList)
>>>>>>> e1a0a5c5dd789735947256a647e594b9228c7316
