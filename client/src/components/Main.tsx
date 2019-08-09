import React, { useContext } from 'react'
import { useSpring, animated, config } from 'react-spring'


import './styles/Main.css'
import Menu from './Menu'
import Inbox from './Inbox/Inbox'
import Chat from './Chat/Chat'
import UserProfile from './Chat/UserProfile'
import Context from '../store/context'

const Main: React.FunctionComponent = () => {
    const { state } = useContext<any>(Context)
    const props = useSpring({
        from: {
            transform: 'translateY(-100px)',
            opacity: 0,
        },
        to: {
            transform: 'translateY(0px)',
            opacity: 1
        },
        config: config.molasses
    })
    return(
        <div className="main">
            <animated.div 
                className="container"
                style={props}
            >
                <aside className="menu">
                    <Menu />
                </aside>
                <section className="chat-inbox">
                    <Inbox />
                </section>
                <section className="main-chat">
                {/* 
                // @ts-ignore */}
                    {state.channel && <Chat chatInfo={state} />}
                </section>
                <aside className="user-profile">
                {/* 
                // @ts-ignore */}
                    {state.channel && <UserProfile profile={state} />}
                </aside>
            </animated.div>
        </div>
    )
}

export default Main

// from: {
//     transform: 'translateY(-100px)',
//     opacity: 0,
// },
// to: {
//     marginTop: 0,
//     opacity: 1
// },
// config: config.molasses