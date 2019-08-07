import React from 'react'
import { Query } from 'react-apollo'

import { GET_CHANNELS_QUERY } from '../../graphql/query'
import { CHANNEL_SUBSCRIPTION } from '../../graphql/subscription'
import Spinner from '../../util/Spinner'
import ChannelList from './ChannelList'
import '../styles/Inbox.css'

const Inbox = () => (
    <div className="inbox">
        <Query
            query={GET_CHANNELS_QUERY}
            options={{ fetchPolicy: 'network-only'}}
        >
            {({ subscribeToMore, loading, error, ...result }) => {
                const { channels } = { channels: result.data }
                if(loading) return <Spinner />
                if(error) return <div>Error</div>
                return (
                    <>
                    <h2>Inbox</h2>
                    <ul className="inbox-list">
                        <ChannelList 
                            {...channels}
                            subscribeToNewChannel={() =>
                            subscribeToMore({
                                document: CHANNEL_SUBSCRIPTION,
                                updateQuery: (prev, { subscriptionData }) => {
                                    if (!subscriptionData.data) return prev;
                                    const newChannel = subscriptionData.data.newChannel
                                    const filteredChannels = prev.channels.filter(channel => channel.id !== newChannel.id)
                                    const combinedChannels = filteredChannels.concat([newChannel]) 
                                    return {
                                            channels: combinedChannels
                                        } 
                                    }
                                }) 
                            }
                        />
                    </ul>
                    </>
                )
            }}
        </Query>   
    </div>
)

export default React.memo(Inbox)
