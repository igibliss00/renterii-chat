import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import "../styles/SharedCard.css"
import trimmedString from '../../util/trimmedString'

const SharedCard = ({ post }) => {
    return (
        <Link 
            className="shared-card"
            to={`/post/${post.id}`}
        >   
            <div className="shared-card-info">
                <p><b>{post.title}</b></p>
                <p>{trimmedString(post.body)}</p>
                <p>${post.price}<small>/day</small></p>
            </div>
            <img 
                src={post.image} 
                alt={post.title} 
                className="items-pic"
            />
        </Link>
    )
}

SharedCard.propTypes = {
    post: PropTypes.object.isRequired,
}

export default React.memo(SharedCard)