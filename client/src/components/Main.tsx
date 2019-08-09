import React, { useContext } from 'react'

import './styles/Main.css'
import Menu from './Menu'
import Inbox from './Inbox/Inbox'
import Chat from './Chat/Chat'
import UserProfile from './Chat/UserProfile'
import Context from '../store/context'

const Main: React.FunctionComponent = () => {
    const { state } = useContext<any>(Context)
    return(
        <div className="main">
            <div className="container">
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
            </div>
        </div>
    )
}

export default Main