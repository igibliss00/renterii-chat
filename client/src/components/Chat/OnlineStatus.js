import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo-hooks'
import { withRouter } from 'react-router-dom'

import { UPDATE_ONLINE_MUTATION } from '../../graphql/mutation'

const OnlineStatus = ({ match, history, subscribeToStatusUpdate, ...result }) => {
    const updateOnlineStatus = useMutation(UPDATE_ONLINE_MUTATION)
    useEffect(() => {
        subscribeToStatusUpdate()
    })

    useEffect(() => {
        history.listen((location, action) => {
            if(location.pathname === match.url){
                try {
                    updateOnlineStatus({
                        variables: {
                            onlineStatus: "online",
                        }
                    })
                } catch(err) {
                    throw new Error(err)
                }
            } else {
                try {
                    updateOnlineStatus({
                        variables: {
                            onlineStatus: "offline",
                        }
                    })
                } catch(err) {
                    throw new Error(err)
                }
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if(result.error) return <div>Online Status error</div>
    const status = result.data.user && result.data.user.onlineStatus
    return (
        <p>{status}</p>
    )
}

OnlineStatus.propTypes = {
    subscribeToStatusUpdate: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
}

export default React.memo(withRouter(OnlineStatus))