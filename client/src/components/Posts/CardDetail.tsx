import React, { useContext } from 'react'
import { useQuery } from 'react-apollo-hooks'

import { GET_POST } from '../../graphql/query'
import Context from '../../store/context'
import Spinner from '../../util/Spinner'
import '../styles/CardDetail.css'
import Map from '../Map/SingleMap'

const CardDetail: React.FunctionComponent = () => {
    const { state } = useContext<any>(Context)
    const id = state.selectedCard
    const { data: { post }, error, loading } = useQuery<any>(GET_POST, {
        variables: {
            id
        }
    })

    if(error) return <div>Detail query error</div>
    if(loading) return <Spinner />
    const { title, body, image, price, author: {firstName, lastName} } = !!post && post
    return (
        <div className="card-detail-info">
            <ul>
                <li>
                    <img src={image} alt={body}/>
                </li>
                <li>
                    <h3>{title}</h3>
                </li>
                <li>
                    <p><span>Author</span>{firstName} {lastName}</p>
                </li>
                <li>
                    <p><span>Description</span>{body}</p>
                </li>
                <li>
                    <p><span>Price</span>${price}/day</p>
                </li>
                <li>
                    <Map post={post} />
                </li>
            </ul>
        </div>
        )
    }

export default React.memo(CardDetail)
