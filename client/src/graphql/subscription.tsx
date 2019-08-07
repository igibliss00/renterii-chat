import { gql } from 'apollo-boost'

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