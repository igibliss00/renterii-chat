import { gql } from 'apollo-boost'

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

export const LOCAL_STATE_MAP_QUERY = gql`
  query {
    mapOpen @client
  }
`

export const LOCAL_MENU_STATE_QUERY = gql`
  query {
    menuOpen @client
  }
`

export const LOCAL_AUTH_MODAL_STATE_QUERY = gql`
  query {
    authModalOpen @client
  }
`

export const LOCAL_LOCATION_SHARE_STATE_QUERY = gql`
  query {
    locationShare @client
  }
`

export const LOCAL_LOCATION_ERROR_STATE_QUERY = gql`
  query {
    locationError @client
  }
`

export const GET_CHANNELS_QUERY = gql`
    query Channels{
        channels{
            id
            members {
                id
                firstName
            }
            updatedAt
            text {
                text
            }
        }
    }
`

export const GET_MY_INFO_SIMPLE = gql`
    query {
        me {
            id
            firstName
            permissions
        }
    }
`