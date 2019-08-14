import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import moment from 'moment'
import Group from '@material-ui/icons/Group'
import { Transition, animated } from 'react-spring/renderprops'

import { GET_ONLINE_STATUS_QUERY } from '../../graphql/query'
import { ONLINE_STATUS_SUBSCRIPTION } from '../../graphql/subscription'
import SharedCard from './SharedCard'
import OnlineStatus from './OnlineStatus'
import Spinner from '../../util/Spinner'

const Message = ({ messages, authId, chatterId, channel }) => {
    if(!messages || !chatterId) return <Spinner />
    return(
        <>
        <div className="onlineStatus">
            <Query
                query={GET_ONLINE_STATUS_QUERY}
                variables={{ 
                    id: chatterId,
                }}
                options={{ fetchPolicy: 'network-only' }}
            >
                {({ subscribeToMore, ...result }) => (
                    <div className={!!result.data.user && result.data.user.onlineStatus === "online" ? "online" : "offline"}>
                        <Group />
                        <OnlineStatus 
                            {...result}
                            subscribeToStatusUpdate={() =>
                                subscribeToMore({
                                    document: ONLINE_STATUS_SUBSCRIPTION,
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) return prev;
                                        const { onlineStatus } = subscriptionData.data
                                        return {
                                            user: onlineStatus
                                        }
                                    }
                                }) 
                            }
                        />
                    </div>
                    )}
            </Query>
        </div>
        <Transition
            native
            items={messages}
            keys={message => message.id}
            from={{ opacity: 0, transform: 'translate3d(0,60px,0)' }}
            enter={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            config={{ tension: 50, friction: 25 }}
        >
            {message => styles => (
                <animated.div
                    className={`chat-bubble ${message.user.id === authId && message.status ? "chat-right-align chat-status" : message.user.id === authId && !message.status ? "chat-right-align" : message.status ? "chat-status" : message.isTyping ? "chat-isTyping" : ""}`}
                    style={styles}
                > 
                    <p>{message.text}</p>
                    <p className="chat-timestamp">    
                        {message.text && moment(message.createdAt).format('h:mma')}
                    </p>
                    <div>
                        {message.image && <img src={message.image} alt={message.image} /> }
                        <p className="chat-timestamp">
                            {message.image && moment(message.createdAt).format('h:mma')}
                        </p>
                    </div>
                    <div>
                        {message.post && <SharedCard post={message.post} />}
                    </div>
                </animated.div>
            )}
        </Transition>
        </>
    )
}

Message.propTypes = {
    messages: PropTypes.array,
    authId: PropTypes.string.isRequired,
    chatterId: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
}

export default React.memo(Message)

  // const [onlineStatus, setOnlineStatus] = useState()
    // const { data: { user }, error, loading } = useQuery(GET_ONLINE_STATUS_QUERY, {
    //     variables: {
    //         id: chatterId
    //     }
    // })
    // const { data: statusUpdate, error: statusUpdateError } = useSubscription(ONLINE_STATUS_SUBSCRIPTION, {
    //     variables: {
    //         chatterId
    //     },
    //     onSubscriptionData: ({ client, subscriptionData }) => {
    //         console.log("client", client)
    //         console.log("subscriptionData", subscriptionData)
    //         setOnlineStatus(subscriptionData)
    //     }
    // })
    // console.log(data && data.user.onlineStatus)
    // const statusUpdate = data && data.onlineStatus.onlineStatus
