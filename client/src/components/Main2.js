import React, { useContext } from 'react'
import { useSpring, animated, config } from 'react-spring'
import {Transition} from 'react-spring/renderprops'
import { useQuery } from 'react-apollo-hooks'

import './styles/Main.css'
import Menu from './Menu2'
import Inbox from './Inbox/Inbox'
import Chat from './Chat/Chat'
import UserProfile from './Chat/UserProfile'
import Context from '../store/context'
import Card from './Posts/Card'
import CardDetail from './Posts/CardDetail'
import NewChannelForm from './Chat/NewChannel/NewChannelForm2'
import Browse from './Chat/Browse/Browse'
import { LOCAL_LOCATION_SHARE_STATE_QUERY } from '../graphql/query'
import ChatMapContainer from './Chat/ChatMapContainer'

const Main = () => {
    const { state } = useContext(Context)

    // toggle query for isShared
    const { data: { locationShare }, error } = useQuery(LOCAL_LOCATION_SHARE_STATE_QUERY)

    // transition animation for the menu
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
    console.log("locationShare", locationShare)
    if(error) return <div>Location Share Error</div>
    const { menu, channel, selectedCard } = !!state && state
    return(
        <div className="main">
            <div className="main-container">
                <animated.aside 
                    className="menu"
                    style={props}
                >
                    <Menu />
                </animated.aside>
                <Transition
                    items={menu}
                    from={{ 
                        opacity: 0,    
                        transform: 'translateX(400px) scale(1)', 
                    }}
                    enter={{ 
                        opacity: 1,
                        transform: 'translateX(0px) scale(1)',
                        delay: 800,
                    }}
                    leave={{ 
                        opacity: 0,
                        transform: 'translateX(400px) scale(1)', 
                    }}
                >
                    {menu => (menu === 'Chat')
                           ? (props => 
                                <>
                                    <section style={props} className="chat-inbox">
                                        <Inbox />
                                    </section>
                                    {channel && <section style={props} className="main-chat">
                                    {/* 
                                    // @ts-ignore */}
                                        <Chat chatInfo={state} />
                                    </section>}
                                    {channel && !locationShare && <aside style={props} className="user-profile">
                                    {/* 
                                    // @ts-ignore */}
                                        <UserProfile profile={state} />
                                    </aside>}
                                    {locationShare && <aside style={props} className="user-location">
                                    {/* 
                                    // @ts-ignore */}
                                        <ChatMapContainer channel={channel}  />
                                    </aside>}
                                </>
                            )
                            : (menu === "Shop")
                            ? (props => 
                                <>
                                    <section style={props} className="main-cards">
                                        <Card />
                                    </section>
                                    {selectedCard && <section style={props} className="card-detail">
                                        <CardDetail />
                                    </section>}
                                </>
                            )
                            : (menu === "Create")
                            ? (props => 
                                <>
                                    <section style={props} className="new-channel-portal">
                                        <NewChannelForm />
                                    </section>
                                </>
                            )
                            : (menu === "Browse")
                            ? (props => 
                                <>
                                    <section style={props} className="browse">
                                        <Browse />
                                    </section>
                                    {selectedCard && <section style={props} className="card-detail">
                                        No communities at the moment
                                    </section>}
                                </>
                            )
                            : ""
                    }
                </Transition>
            </div>
        </div>
    )
}

export default Main