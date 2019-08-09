import { gql } from 'apollo-boost'

export const GET_MY_INFO = gql`
    query {
        me {
            id
            firstName
            email
            posts {
                id
                title
                price
                quantity
                image
                booking {
                    renter {
                        firstName
                    }
                    endDate
                    overdue
                }
            }
            borrowing {
                post {
                    title
                    image
                    location
                }
                endDate
                overdue
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

export const CART_INFO = gql`
    query {
        cart {
            id
            quantity
            startDate
            endDate
            post {
                id
                title
                image
                price
                location
                longitude
                latitude
            }
            user {
                firstName
                email
            }
        }
    }
`

export const GET_USERS = gql`
    query {
        users {
            id
            firstName
            lastName
            permissions
        }
    }
`

export const GET_USER = gql`
    query User($id: ID!) {
        user(id: $id) {
            id
            firstName
            lastName
            email
            createdAt
            posts {
                id
                title
                price
                image
                location
                longitude
                latitude
            }
        }
    }
`


export const GET_POSTS = gql`
    query Posts($id: ID, $query: String, $skip: Int, $first: Int, $orderBy: UserOrderByInput){
        posts (
            id: $id
            query: $query
            skip: $skip
            first: $first
            orderBy: $orderBy
        ){
            id
            title
            body
            location
            published
            price
            image
            largeImage
            author {
                id
                firstName
                lastName
            }
            booking {
              startDate
              endDate
            }
            longitude
            latitude
        }
    }
`

export const GET_POST = gql`
    query Post($id: ID!) {
        post(
            id: $id
        ){
            id
            title
            body
            location
            price
            image
            quantity
            author {
                id
                firstName
                lastName
            }
            latitude
            longitude
            booking {
                startDate
                endDate
            }
        }
    }
`



export const SINGLE_POST_QUERY = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
      title
      body
      location
      published
      price
    }
  }
`

export const GET_BOOKING = gql`
    query Bookings($id: ID) {
        bookings(
            id: $id 
        ){
            id
            renter {
                firstName
            }
            item {
                title
                location
                author {
                    firstName
                    }
            price
            }		
        }
    }
`

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
        
export const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      charge
      posts {
            quantity
            post {
                id
                title
                price
                image
            }
        }
    }
  }
`;

export const SINGLE_ORDER_QUERY = gql`
    query Order($id: ID!){
        order(
            id: $id
        ){
            id
            charge
            total
            createdAt
            user {
                id
            }
            posts {
                startDate
                endDate
                post {
                    id
                    title
                    body
                    price
                    image
                    quantity
                }
            }
        }
    }
`

export const PAGINATION_QUERY = gql`
    query {
        postsConnection {
            aggregate {
            count
            }
        }
    }
`

export const GET_MESSAGES_QUERY =  gql`
    query Messages($channel: String!) {
        messages(
            channel: $channel
        ){
            id
            text
            image
            user {
                id
                firstName
                onlineStatus
            }
            status
            isTyping
            createdAt
            post {
                id
                title
                body
                image
                price 
            }
        }
    }
`



export const GET_LOCATION_QUERY = gql`
    query Locations {
        locations {
            longitude
            latitude
            user {
                id
            }
        }
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

export const GET_CHAT_POSTS = gql`
    query Posts($id: ID, $query: String, $author: String, $skip: Int, $first: Int, $orderBy: UserOrderByInput){
        posts (
            id: $id
            query: $query
            author: $author
            skip: $skip
            first: $first
            orderBy: $orderBy
        ){
            id
            title
            body
            price
            image
        }
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

export const GET_MY_CHAT_POSTS = gql`
    query {
        me {
            posts {
                id
                title
                body
                price
                image
            }
        }
    }   
`

export const GET_ONLINE_STATUS_QUERY = gql`
    query User($id: ID!){
    	user(id: $id){
            onlineStatus
      }
    }
`