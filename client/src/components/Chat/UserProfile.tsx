import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo-hooks'
import moment from 'moment/moment.js'

import { GET_USER } from '../../graphql/query'
import { AUTH_ID } from '../../constants'
import Spinner from '../../util/Spinner'
import '../styles/UserProfile.css'

type Profile = {
    profile: {
        members: any[] 
    }
}

const UserProfile = ({ profile: { members }}: Profile) => {
    const authId = window.localStorage.getItem(AUTH_ID)
    const chatUsername = members && members.filter(member => member.id !== authId)
    const { data: { user }, error, loading }: any = useQuery(GET_USER, {
        variables: {
            id: chatUsername[0].id
        }
    })
    if(error) return <div>Profile error</div>
    if(loading) return <Spinner />
    console.log("data", user)
    const { firstName, lastName, createdAt, email, id } = user
    return(
        <div className="user-profile-detail">
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
            </ul>
        </div>
    )
}

UserProfile.propTypes = {
    members: PropTypes.array.isRequired,
}

export default React.memo(UserProfile)