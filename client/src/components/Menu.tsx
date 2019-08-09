import React from 'react'
import ChatIcon from '@material-ui/icons/Chat'
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import Settings from '@material-ui/icons/Settings'

import './styles/Menu.css'

const Menu: React.FunctionComponent = () => {

    return (
        <ul className="chat-menu">
            <li>
                <img src={require("../media/Renterii_logo_shape_r.png")} alt="renterii logo"/>
            </li>
            <li>
                <ChatIcon className="menu-icons" /> 
                Chat
            </li>
            <li>
                <ShoppingCart className="menu-icons" />
                Shop
            </li>
            <li>
                <Settings className="menu-icons" />
                Settings
            </li>
        </ul>
    )
}

export default Menu