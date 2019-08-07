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