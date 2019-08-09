import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split, Observable } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';

import './components/styles/index.css';
import * as serviceWorker from './serviceWorker';
import './components/styles/index.css';
import App from './App';
import { AUTH_TOKEN, OAUTH_TOKEN } from './constants'
import { 
  LOCAL_STATE_QUERY, 
  LOCAL_STATE_MAP_QUERY, 
  LOCAL_MENU_STATE_QUERY, 
  LOCAL_AUTH_MODAL_STATE_QUERY, 
  LOCAL_LOCATION_SHARE_STATE_QUERY,
  LOCAL_LOCATION_ERROR_STATE_QUERY
} from './graphql/query'

const cache = new InMemoryCache();

const httpLink = new HttpLink({
    // uri: 'http://localhost:4000',
    uri: 'https://floating-waters-72393.herokuapp.com/',
    credentials: 'same-origin'
});
  
const wsLink = new WebSocketLink({
    // uri: `ws://localhost:4000/`,
    uri: `wss://floating-waters-72393.herokuapp.com/`,
    options: {
      reconnect: true,
    },
});
  
const terminatingLink = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
);

const request = async (operation: any) => {
  //token from a regular login 
  const token = localStorage.getItem(AUTH_TOKEN) 
  //token from google login
  const token2 = localStorage.getItem(OAUTH_TOKEN) 
  const realToken = token ? token : token2
  operation.setContext({
    headers: {
      authorization: realToken
    }
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle: any;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward!(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);
  
const link = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      // throw new Error("graphQLErrors", graphQLErrors);
      console.log(graphQLErrors)
    }
    //if network error, logout
    if (networkError) {
      console.log("network error", networkError)
      window.localStorage.removeItem(AUTH_TOKEN);
      window.localStorage.removeItem(OAUTH_TOKEN);
    }
  }),
  requestLink,
  withClientState({
    defaults: {
      isConnected: true,
      cartOpen: false,
      mapOpen: false,
      menuOpen: false,
      authModalOpen: false,
      locationShare: false,
      locationError: false,
    },
    resolvers: {
      Mutation: {
        updateNetworkStatus: (_: any, { isConnected }: any, { cache }: any) => {
          cache.writeData({ data: { isConnected }});
          return null;
        },
        toggleCart(_: any, variables: any, { cache }: any) {
          // read the cartOpen value from the cache
          const { cartOpen } = cache.readQuery({
            query: LOCAL_STATE_QUERY,
          });
          // Write the cart State to the opposite
          const data = {
            data: { cartOpen: !cartOpen },
          };
          cache.writeData(data);
          return data;
        },
        closeCart(_: any, variables: any, { cache }: any) {
          // read the cartOpen value from the cache
          const { cartOpen } = cache.readQuery({
            query: LOCAL_STATE_QUERY,
          });
          if(cartOpen === true) {
            const data = {
              data: { cartOpen: !cartOpen },
            };
            cache.writeData(data);
            return data;
          }
        },
        toggleMap(_: any, variables: any, { cache }: any) {
          // read the cartOpen value from the cache
          const { mapOpen } = cache.readQuery({
            query: LOCAL_STATE_MAP_QUERY,
          });
          // Write the cart State to the opposite
          const data = {
            data: { mapOpen: !mapOpen },
          };
          cache.writeData(data);
          return data;
        },
        toggleMenu(_: any, variables: any, { cache }: any) {
        // read the menuOpen value from the cache
        const { menuOpen } = cache.readQuery({
          query: LOCAL_MENU_STATE_QUERY,
        });
        // Write the menu State to the opposite
        const data = {
          data: { menuOpen: !menuOpen },
        };
        cache.writeData(data);
        return data;
        },
        closeMenu(_: any, variables: any, { cache }: any) {
          // read the cartOpen value from the cache
          const { menuOpen } = cache.readQuery({
            query: LOCAL_MENU_STATE_QUERY,
          });
          if(menuOpen === true) {
            const data = {
              data: { menuOpen: !menuOpen },
            };
            cache.writeData(data);
            return data;
          }
        },
        toggleAuthModal(_: any, variables: any, { cache }: any) {
          // read the cartOpen value from the cache
          const { authModalOpen } = cache.readQuery({
            query: LOCAL_AUTH_MODAL_STATE_QUERY,
          });
          // Write the menu State to the opposite
          const data = {
            data: { authModalOpen: !authModalOpen },
          };
          cache.writeData(data);
          return data;
        },
        closeAuthModal(_: any, variables: any, { cache }: any) {
          // read the cartOpen value from the cache
          const { authModalOpen } = cache.readQuery({
            query: LOCAL_AUTH_MODAL_STATE_QUERY,
          });
          if(authModalOpen === true) {
            const data = {
              data: { authModalOpen: !authModalOpen },
            };
            cache.writeData(data);
            return data;
          }
        },
        toggleLocationShare(_: any, variables: any, { cache }: any) {
          const { locationShare } = cache.readQuery({
            query: LOCAL_LOCATION_SHARE_STATE_QUERY,
          })
          const data = {
            data: { locationShare: !locationShare },
          }
          cache.writeData(data)
          return data 
        },
        closeLocationShare(_: any, variables: any, { cache }: any) {
          // read the cartOpen value from the cache
          const { locationShare } = cache.readQuery({
            query: LOCAL_LOCATION_SHARE_STATE_QUERY,
          });
          if(locationShare === true) {
            const data = {
              data: { locationShare: !locationShare },
            };
            cache.writeData(data);
            return data;
          }
        },
        toggleLocationError(_: any, variables: any, { cache }: any) {
          const { locationError } = cache.readQuery({
            query: LOCAL_LOCATION_ERROR_STATE_QUERY,
          })
          const data = {
            data: { locationError: !locationError },
          }
          cache.writeData(data)
          return data 
        },
      }
    },
    cache
  }),
  terminatingLink,
]);
    
const client = new ApolloClient({
    link,
    cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <App />
      </ApolloHooksProvider>
  </ApolloProvider>,
document.getElementById('root')
)

serviceWorker.register();

