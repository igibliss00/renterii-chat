import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'

import './styles/Landing.css'
import Auth from './Auth/Auth'

const config = { 
    mass: 5, 
    tension: 2000, 
    friction: 200,
    duration: 300,
}

const Landing: React.FunctionComponent = () => {
    const [toggle, set] = useState<boolean>(false)
    const props = useSpring<any>({
        marginTop: toggle ? -600: 0,
        opacity: toggle ? 1: 0,
        config
    })

    const onClickHandler = () => {
        set(state => !state)
    }

    return(
        <div className="v-header container">
            <div className="fullscreen-video-wrap">
                <video loop autoPlay muted>
                    <source src={require("../media/landing.mp4")} type="video/mp4" />Your browser does not support the video tag. I suggest you upgrade your browser.
                </video>            
            </div>
            <div className="header-overlay"></div>
            <img src={require("../media/Renterii_logo_r.png")} alt=""/>
            <figure 
                className={`${toggle && "fade"}`}
                onClick={onClickHandler}>
                <div>
                    <span>Enter</span>
                    <span>Click Me!</span>
                </div>
            </figure>
            <animated.div className="auth" style={props}>
                <Auth />
            </animated.div>
        </div>
    )
}

export default Landing