import React, { useContext } from 'react'
import { useSpring, useTransition, animated, config } from 'react-spring'
import {Transition} from 'react-spring/renderprops'

import './styles/Main.css'
import Menu from './Menu2'
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

    const { menu, channel } = state
    // const transitions = useTransition(items, item => item.key, {
    // from: { 
    //     opacity: 0,    
    //     transform: 'translateY(-400px) scale(0) rotateX(90deg)', 
    // },
    // enter: { 
    //     opacity: 1,
    //     transform: 'translateY(0px) scale(1) rotateX(0deg)',
    // },
    // leave: { 
    //     opacity: 0,
    //     transform: 'translateY(-400px) scale(0) rotateX(90deg)', 
    // },
    // return transitions.map(({ item, props, key }) =>
    //     <animated.div key={key} style={props}>Hello</animated.div>
    // )
    // const { data, error, loading } = useQuery(GET_POSTS)

    
    return(
        <div className="main">
            <div className="main-container">
                <animated.aside 
                    className="menu"
                    style={props}
                >
                    <Menu />
                </animated.aside>
            {menu === "Chat" && (
                <>
                <Transition
                    items={menu}
                    from={{ 
                        opacity: 0,    
                        transform: 'translateY(-400px) scale(0) rotateX(90deg)', 
                    }}
                    enter={{ 
                        opacity: 1,
                        transform: 'translateY(0px) scale(1) rotateX(0deg)',
                    }}
                    leave={{ 
                        opacity: 0,
                        transform: 'translateY(-400px) scale(0) rotateX(90deg)', 
                    }}
                >
                    {menu => 
                    (props => 
                        <>
                            <section style={props} className="chat-inbox">
                                <Inbox />
                            </section>
                            <section style={props} className="main-chat">
                            {/* 
                            // @ts-ignore */}
                                {channel && <Chat chatInfo={state} />}
                            </section>
                            <aside style={props} className="user-profile">
                            {/* 
                            // @ts-ignore */}
                                {channel && <UserProfile profile={state} />}
                            </aside>
                        </>
                    )}
                </Transition>
                </>
            )}
            {menu === "Shop" && (
                <>
                    <section className="main-cards">
                        Hello
                    </section>             
                </>
            )}
            </div>
        </div>
    )
}

export default Main


// if(menu === "Chat") {
//     return (
//         <Transition
//             items={menu}
//             from={{ 
//                 opacity: 0,    
//                 transform: 'translateY(-400px) scale(0) rotateX(90deg)', 
//             }}
//             enter={{ 
//                 opacity: 1,
//                 transform: 'translateY(0px) scale(1) rotateX(0deg)',
//             }}
//             leave={{ 
//                 opacity: 0,
//                 transform: 'translateY(-400px) scale(0) rotateX(90deg)', 
//             }}
//         >
//         {menu => 
//         (props => 
//                 <>
//                     <section style={props} className="chat-inbox">
//                         <Inbox />
//                     </section>
//                     <section style={props} className="main-chat">
//                     {/* 
//                     // @ts-ignore */}
//                         {channel && <Chat chatInfo={state} />}
//                     </section>
//                     <aside style={props} className="user-profile">
//                     {/* 
//                     // @ts-ignore */}
//                         {channel && <UserProfile profile={state} />}
//                     </aside>
//                 </>
//                 )
//         }
//         </Transition>
//     )
// }