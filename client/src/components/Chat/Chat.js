import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

import { MESSAGE_SUBSCRIPTION } from '../../graphql/subscription'
import { GET_MESSAGES_QUERY } from '../../graphql/query'
import SubChat from './SubChat'
import { AUTH_ID } from '../../constants'

const Chat = ({ chatInfo: { members, channel } }) => {

    if(!channel || !members) {
        return <div>no data</div>
    }
    const authId = window.localStorage.getItem(AUTH_ID)      
    return (
        <Query
            query={GET_MESSAGES_QUERY}
            variables={{ channel }}
            options={{ fetchPolicy: 'network-only'}}
        >
            {({ subscribeToMore, ...result }) => (
                <SubChat
                    {...result}
                    channel={channel}
                    members={members}
                    subscribeToNewMessages={() =>
                    subscribeToMore({
                        document: MESSAGE_SUBSCRIPTION,
                        variables: { 
                            channel
                        },
                        updateQuery: (prev, { subscriptionData }) => {
                            if (!subscriptionData.data) return prev;
                            const newMessage = subscriptionData.data.newMessage
                            if(newMessage.user.id === authId && newMessage.isTyping === true) {
                                return {
                                    messages: prev.messages
                                }
                            }

                            const indicatorMessages = prev.messages.filter(message => message.isTyping === true && message.user.id !== authId)
                            
                            if(indicatorMessages) {
                                prev.messages = prev.messages.filter(message => !indicatorMessages.includes(message))
                            }
                            
                            const combinedMessages = prev.messages.concat([newMessage])
                            return {
                                    messages: combinedMessages
                                } 
                            }
                        }) 
                    }
                />
            )}
        </Query>
    )
}

Chat.propTypes = {
    channel: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
}

export default React.memo(Chat)

//  prev.messages = prev.messages.filter(message => message.isTyping === false || message.user.id !== authId)


 