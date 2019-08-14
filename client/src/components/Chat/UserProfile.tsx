import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo-hooks'
import moment from 'moment/moment.js'
import {useSpring, animated, config} from 'react-spring'

import { GET_USER } from '../../graphql/query'
import { AUTH_ID } from '../../constants'
import Spinner from '../../util/Spinner'
import '../styles/UserProfile.css'
import MyChatPosts from './MyChatPosts'
import TheirChatPosts from './TheirChatPosts'
import Context from '../../store/context'

type Profile = {
    profile: {
        members: any[] 
    }
}

interface Toggle {
    myPosts: boolean,
    theirPosts: boolean,
}

const UserProfile = ({ profile: { members }}: Profile) => {
    const props = useSpring({
        delay: 600,
        from: {
            transform: 'translateY(-20px)',
            opacity: 0,
        },
        to: {
            transform: 'translateY(0px)',
            opacity: 1
        },
        config: config.molasses
    })

    const { state }:any = useContext(Context)
    const [ toggle, setToggle ]= useState<Toggle>({
        myPosts: false,
        theirPosts: false
    })

    const myPostsHandler = (): void => {
        setToggle({ myPosts: true, theirPosts: false })
    }

    const theirPostsHandler = (): void => {
        setToggle({ myPosts: false, theirPosts: true })
    }

    const authId:any = window.localStorage.getItem(AUTH_ID)
    const chatUsername = members && members.filter(member => member.id !== authId)
    const { data: { user }, error, loading }: any = useQuery(GET_USER, {
        variables: {
            id: chatUsername[0].id
        }
    })
    if(error) return <div>Profile error</div>
    if(loading) return <Spinner />
    const { firstName, lastName, createdAt, email, id } = user
    return(
        <animated.div 
            className="user-profile-detail"
            style={props}
        >
            <div className="chat-upper-profile">
                <img src="https://source.unsplash.com/random" alt=""/>
                <p>{firstName} {lastName}</p>
            </div>
            <ul className="chat-lower-profile">
                <li>
                    <span>email</span>{email}
                </li>
                <li>
                    <span>member since</span> {moment(createdAt).format("MMM-YYYY")}
                </li>
                <li>
                    <span>user ID</span> {id}
                </li>
                <li>
                    <button onClick={myPostsHandler}>My Posts</button>
                    <button onClick={theirPostsHandler}>{firstName}'s Posts</button>
                </li>
            </ul>
            {toggle.myPosts && 
                <MyChatPosts 
                    channel={state.channel}
                    chatterId={id} 
                />
            }
            {toggle.theirPosts && 
                <TheirChatPosts 
                    author={user} 
                    channel={state.channel}
                    chatterId={id} 
                />
            }
        </animated.div>
    )
}

UserProfile.propTypes = {
    members: PropTypes.array.isRequired,
}

export default UserProfile

