import React, {useContext } from 'react'
import { useTrail, animated, config } from 'react-spring'
import { useQuery } from 'react-apollo-hooks'

import { GET_POSTS } from '../../graphql/query'
import Spinner from '../../util/Spinner'
import trimmedString from '../../util/trimmedString'
import { AUTH_ID, SELECT_CARD } from '../../constants'
import '../styles/Card.css'
import Context from '../../store/context'

const Card = () => {
    const { dispatch } = useContext(Context)
    const { data: { posts }, error, loading } = useQuery(GET_POSTS)

    const trail = useTrail(posts && posts.length, {
        from: {
            marginTop: -30,
            opacity: 0,
        },
        to: {
            marginTop: 30,
            opacity: 1
        }
    })
    const authId = localStorage.getItem(AUTH_ID)

    const onClickHandler = id => {
        dispatch({ type: SELECT_CARD, payload: id })
    }

    if(error) return <div>query error</div>
    if(loading) return <Spinner />
    return trail.map((props, index) => {
        const {id, title, body, author, price, longitude, latitude, image } = posts[index]
        return  (
            // either when a pin is selected or the card itself is selected, show the card's background as selected
            <animated.div 
                className="card"
                key={id}
                style={props}
                onClick={() => onClickHandler(id)}
            >   
                <div 
                    data-btn="detail" 
                    to={`/post/${id}`}
                >
                    <img src={image} alt={body} />
                    <p>
                        <b>{title}</b>
                    </p>
                    <p>{trimmedString(body)}</p>
                    <p>
                        <b>${price}</b>
                        <small>/day</small>
                    </p>
                </div>
                <div className="button-list">
                    { authId === author.id &&
                        <>
                            <div className="btn">
                                <div 
                                    data-btn="edit" 
                                    to={`/post/${id}/edit`}
                                >
                                Edit
                                </div>
                            </div>
                            {/* <DeletePost id={id} /> */}
                        </>   
                    }
                </div>    
            </animated.div>  
        )
    })
}

export default React.memo(Card)