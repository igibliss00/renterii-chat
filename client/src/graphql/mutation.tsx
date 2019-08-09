import { gql } from 'apollo-boost'

export const OAUTH_MUTATION = gql`
  mutation {
    googleLogin {
      token
      user {
        firstName
        image
      }
    }
  }
`
export const TOGGLE_AUTH_MODAL_MUTATION = gql`
  mutation {
    toggleAuthModal @client
  }
`

export const CLOSE_AUTH_MODAL_MUTATION = gql`
  mutation {
    closeAuthModal @client
  }
`

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!){
        login(
            data: {
                email: $email
                password: $password
            }
        ){
            token
            user {
                id
                permissions
            }
        }
    }
`

export const OPEN_CART_MUTATION = gql`
  mutation {
    openCart @client
  }
`

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

export const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      token
      user {
        id
      }
      message
    }
  }
`

export const SIGNUP_MUTATION = gql`
    mutation Signup($firstName: String!, $lastName: String!, $email: String!, $password: String!){
        createUser(
            data: {
                firstName: $firstName
                lastName: $lastName
                email: $email
                password: $password
            }
        ){
            token
            user {
                id
                permissions
            }
        }
    }
`


export const CREATE_LOCATION_MUTATION = gql`
  mutation CreateLocation($latitude: Float!, $longitude: Float!, $channel: String!, $isShared: Boolean!) {
    createLocation(
      data:{
        latitude: $latitude
        longitude: $longitude 
        channel: $channel
        isShared: $isShared
      }
    )
  }
`

export const TOGGLE_LOCATION_SHARE_MUTATION = gql`
  mutation {
    toggleLocationShare @client
  }
`

export const CLOSE_LOCATION_SHARE_MUTATION = gql`
  mutation {
    closeLocationShare @client
  }
`

export const DELETE_LOCATION_MUTATION = gql`
  mutation DeleteLocation($channel: String!) {
    deleteLocation(
      channel: $channel
      )
  }
`

export const TOGGLE_LOCATION_ERROR_MUTATION = gql`
  mutation {
    toggleLocationError @client
  }
`

export const SET_OFFLINE_MUTATION = gql`
  mutation UpdateOnlineStatus($onlineStatus: String!){
    updateOnlineStatus(
      data: {
        onlineStatus: $onlineStatus
      }
    ){
      id
    }
  }
`

export const UPDATE_ONLINE_MUTATION = gql`
  mutation UpdateOnlineStatus($onlineStatus: String!){
    updateOnlineStatus(
      data: {
        onlineStatus: $onlineStatus
      }
    ){
      onlineStatus
    }
  }
`

export const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessage($text: String, $image: String, $largeImage: String, $chatterId: String!, $channel: String!, $status: Boolean, $isTyping: Boolean, $post: String) {
    createMessage(
        data: {
          text: $text
          image: $image
          largeImage: $largeImage
          chatterId: $chatterId
          channel: $channel
          status: $status
          isTyping: $isTyping
          post: $post
          }
      )
  }
`

export const TOGGLE_MAP_MUTATION = gql`
  mutation {
    toggleMap @client
  }
`
