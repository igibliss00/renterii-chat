import React, { useContext } from 'react'
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import Settings from '@material-ui/icons/Settings'
import ExitToApp from '@material-ui/icons/ExitToApp'
import { useTrail, animated } from 'react-spring'
import Treeview from "./Treeview/Treeview"

import './styles/Menu.css'
import Context from '../store/context'
import { SELECT_MENU } from '../constants'

const Menu: React.FunctionComponent = () => {
    const { dispatch } = useContext<any>(Context)
    const trail = useTrail(menuArr.length, {
        from: {
            transform: 'translateX(-20px)',
            opacity: 0,
        },
        to: {
            transform: 'translateX(20px)',
            opacity: 1
        },
        delay: 1500,
    })

    const onClickHandler = (menu: any):void => {
        const { key } = menu
        dispatch({ type: SELECT_MENU, payload: key })
    }

    return <ul className="chat-menu">
                {trail.map((props, index) => {
                    const menu = menuArr[index]
                    return (
                        <animated.li 
                            key={index}
                            style={props}
                            onClick={() => onClickHandler(menu)}
                        >
                            {menu.icon}
                            {menu.name}
                        </animated.li>    
                    )}
                )}
            </ul>
}

const menuArr = [
    {
        icon: <img src={require("../media/Renterii_logo_w.png")} alt="renterii logo"/>
    },
    {
        icon: <Treeview />,
        name: "",
        key: "Chat",
    },
    {
        icon: <ShoppingCart className="menu-icons" />,
        name: "Shop",
        key: "Shop",
    },
    {
        icon: <Settings className="menu-icons" />,
        name: "Settings",
        key: "Settings",
    },
    {
        icon: <ExitToApp className="menu-icons" />,
        name: "Logout",
        key: "Logout",
    },   
]

export default React.memo(Menu)