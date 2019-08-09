import { gql } from 'apollo-boost'

export const MESSAGE_SUBSCRIPTION = gql`
    subscription NewMessage($channel: String!){
        newMessage(
                channel: $channel
            ){
            id
            text
            image
            createdAt
            chatterId
            user {
                id
                firstName
            }
            status
            isTyping
            post {
                id
                title
                body
                price
                image
            }
        }
    }
`

export const CHANNEL_SUBSCRIPTION = gql`
    subscription NewChannel {
        newChannel{
            id
            updatedAt
            text {
                text
            }
            members {
                id
                firstName
            }
        }
    }
`

export const LOCATION_SUBSCRIPTION = gql`
    subscription NewLocation($channel: String!, $isShared: Boolean!) {
        newLocation(
            channel: $channel
            isShared: $isShared
        ){
            user {
                id
            }
            longitude
            latitude
            isShared
        }
    }
`

export const ONLINE_STATUS_SUBSCRIPTION = gql`
    subscription OnlineStatus {
        onlineStatus{
            onlineStatus
        }
    }
    
`