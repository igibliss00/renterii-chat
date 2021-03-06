import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import moment from 'moment'
import Group from '@material-ui/icons/Group'

import { GET_ONLINE_STATUS_QUERY } from '../../graphql/query'
import { ONLINE_STATUS_SUBSCRIPTION } from '../../graphql/subscription'
import SharedCard from './SharedCard'
import OnlineStatus from './OnlineStatus'

const Message = ({ messages, authId, chatterId, channel }) => {
    return(
        <>
        <div className="onlineStatus">
            <Query
                query={GET_ONLINE_STATUS_QUERY}
                variables={{ 
                    id: chatterId,
                }}
                options={{ fetchPolicy: 'network-only'}}
            >
                {({ subscribeToMore, ...result }) => (
                    <div className={result.data.user && result.data.user.onlineStatus === "online" ? "online" : "offline"}>
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
        {messages && messages.map(message => 
            <div
                key={message.id}
                className={`chat-bubble ${message.user.id === authId && message.status ? "chat-right-align chat-status" : message.user.id === authId && !message.status ? "chat-right-align" : message.status ? "chat-status" : message.isTyping ? "chat-isTyping" : ""}`}
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
            </div>
        )}
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