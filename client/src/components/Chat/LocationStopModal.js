import React from 'react'
import PropTypes from 'prop-types'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Cancel from '@material-ui/icons/Cancel'
import { useQuery, useMutation } from 'react-apollo-hooks'

import { CLOSE_LOCATION_SHARE_MUTATION, CREATE_MESSAGE_MUTATION } from '../../graphql/mutation'
import { LOCAL_STATE_MAP_QUERY } from '../../graphql/query'

const LocationStopModal = ({ closeModal, toggleMap, myUsername, chatterId, channel, mapToggle }) => {
    const closeLocationShare = useMutation(CLOSE_LOCATION_SHARE_MUTATION)
    const createMessage = useMutation(CREATE_MESSAGE_MUTATION)
    const { data: { mapOpen } } = useQuery(LOCAL_STATE_MAP_QUERY)

    const locationHandler = async () => {
        try {
            closeLocationShare()
            closeModal()
            toggleMap()
            !!mapOpen && await createMessage({
                variables: { 
                    text: `${myUsername[0].firstName} has stopped sharing his/her current location`,
                    chatterId: chatterId,
                    channel: channel,
                    status: true,
                }
            })
        } catch(err) {
            throw new Error(err)
        }
    }
    return(
        <>
            <p>Would you like to stop sharing your location?</p>
            <div className="modal-buttons">
                <CheckCircle 
                    className="check-circle" 
                    onClick={locationHandler}
                />
                <Cancel 
                    className="cancel" 
                    onClick={() => closeModal()}
                />
            </div>
        </>
    )
}

LocationStopModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    toggleMap: PropTypes.func.isRequired,
    myUsername: PropTypes.array.isRequired,
    chatterId: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
}

export default React.memo(LocationStopModal)