import React from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'

import { GET_MY_CHAT_POSTS } from '../../graphql/query'
import { CREATE_MESSAGE_MUTATION } from '../../graphql/mutation'
import Spinner from '../../util/Spinner'
import '../styles/ChatPosts.css'
import trimmedString from '../../util/trimmedString'

const MyChatPosts = ({ chatterId, channel }) => {
    const { data: { me }, error, loading } = useQuery(GET_MY_CHAT_POSTS)
    const createMessage = useMutation(CREATE_MESSAGE_MUTATION)

    if(error) return <div>Query error</div>
    if(loading) return <Spinner />

    const onShareHandler = async (post) => {
        try {
            await createMessage({
                variables: {
                    post: post.id,
                    chatterId,
                    channel,
                }
            })
        } catch(err) {
            throw new Error(err)
        }
    }

    const list = me.posts.map(post => 
        <div 
            className="items"
            key={post.id}    
        >   
            <div className="chat-post-content">
                <div>
                    <p><b>{post.title}</b></p>
                    <p>{trimmedString(post.body)}</p>
                    <p>${post.price}<small>/day</small></p>
                </div>
                <div className="chat-post-buttons">
                    <Link
                        className="link"
                        to={`/post/${post.id}`}
                    >Detail
                    </Link>
                    <button onClick={() => onShareHandler(post)}>Share on Chat</button>
                </div>
            </div>
            <img 
                src={post.image} 
                alt={post.body} 
                className="items-pic"
            />
        </div>
    )
    return (
        <div className="inventory">
            <h3 className="title">My Posts</h3>
            <ul>
                <li>{list}</li>
            </ul>
        </div>
    )
}

MyChatPosts.propTypes = {
    channel: PropTypes.string.isRequired,
    chatterId: PropTypes.string.isRequired,
}

export default React.memo(MyChatPosts)