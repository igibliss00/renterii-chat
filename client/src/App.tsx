/* eslint-disable import/first */

import React, {useContext, useReducer, Suspense, lazy } from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

// import { AuthRoute, UnauthRoute } from 'react-router-auth'

const Landing = lazy(() => import('./components/Landing'))
const Main = lazy(() => import('./components/Main2'))
const RequestReset = lazy(() => import( './components/Auth/RequestReset'))  
const Reset = lazy(() => import('./components/Auth/Reset')) 
const Inbox = lazy(() => import( './components/Inbox/Inbox'))  
import Context  from './store/context'
import reducer from './store/reducer'
import Spinner from './util/Spinner'

const App = () => {
  const initialState = useContext<any>(Context)
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    // @ts-ignore
    <Context.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route 
              exact 
              path="/" 
              component={Landing} 
            />
            <Route 
              exact 
              path="/main" 
              component={Main} 
            />
            <Route 
              exact 
              path="/requestreset" 
              component={RequestReset}
            />
            <Route 
              exact 
              path="/reset" 
              component={Reset}
            />
            <Route 
              exact
              path="/inbox" 
              component={Inbox} 
            />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default React.memo(App)
