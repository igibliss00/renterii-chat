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