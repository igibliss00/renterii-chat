import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

import ChatMap from '../Map/ChatMap'
import { GET_LOCATION_QUERY } from '../../graphql/query'
import { LOCATION_SUBSCRIPTION } from '../../graphql/subscription'
import Spinner from '../../util/Spinner'

class ChatMapContainer extends PureComponent {
    render() {
        const { channel } = !!this.props && this.props
        return(
            // retrieve user's own position as well as the other party if they allow the location sharing
            <Query
                query={GET_LOCATION_QUERY}
                options={{ fetchPolicy: 'network-only'}}
            >
                {({ subscribeToMore, loading, error, ...result }) => (
                    <>
                    {loading && <Spinner />}
                    {error && <div>Query error</div>}
                    <ChatMap
                        {...result}
                        channel={channel}
                        subscribeToNewMessages={() =>
                        subscribeToMore({
                            document: LOCATION_SUBSCRIPTION,
                            variables: {
                                channel,
                                isShared: true,
                                },
                            updateQuery: (prev, { subscriptionData }) => {
                                if (!subscriptionData.data) return prev;
                                const newLocation = subscriptionData.data.newLocation
                                return {
                                        locations: newLocation
                                    } 
                                },
                            onError: err => console.log(err)
                            }) 
                        }
                    />
                    </>
                )}
            </Query>
        )
    }
}

ChatMapContainer.propTypes = {
    channel: PropTypes.string.isRequired,
}

export default ChatMapContainer