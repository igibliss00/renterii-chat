import { withFilter } from "graphql-yoga";

import getUserId from '../utils/getUserId'
import { PUBSUB_NEW_MESSAGE, PUBSUB_NEW_CHANNEL, PUBSUB_NEW_LOCATION, PUBSUB_ONLINE_STATUS }  from '../utils/constants'

const Subscription = {
    newMessage: {
        subscribe: withFilter(
            (parent, args, { pubsub }, info) => pubsub.asyncIterator(PUBSUB_NEW_MESSAGE),
            (payload, variables) => {
                return payload.newMessage.channel.id === variables.channel
            }             
        ) 
    },
    newChannel: {
        subscribe: (parent, args, { pubsub }, info) => pubsub.asyncIterator(PUBSUB_NEW_CHANNEL),
    },
    newLocation: {
        subscribe: withFilter(
            (parent, args, { pubsub }, info) => pubsub.asyncIterator(PUBSUB_NEW_LOCATION),
            (payload, variables) => {
                return (payload.newLocation.channel.id === variables.channel)  
                    && (!payload.newLocation.isShared || !variables.isShared || payload.newLocation.isShared === variables.isShared)
            }
        )
    },
    onlineStatus: {
        subscribe: (parent, args, { pubsub }, info) => pubsub.asyncIterator(PUBSUB_ONLINE_STATUS), 
    }
}

export { Subscription as default }

// subscribe: withFilter(
//     (parent, args, { pubsub }, info) => pubsub.asyncIterator(PUBSUB_ONLINE_STATUS),
//     (payload, variables) => {
//         console.log("payload.onlineStatus.channels", payload.onlineStatus.channels)
//         console.log("variables.chatterId", variables.chatterId)
//         return payload.onlineStatus.id === variables.chatterId
//     }
// ),