import React from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'react-apollo-hooks'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Cancel from '@material-ui/icons/Cancel'

import { TOGGLE_LOCATION_SHARE_MUTATION, CREATE_MESSAGE_MUTATION } from '../../graphql/mutation'
import { LOCAL_STATE_MAP_QUERY } from '../../graphql/query'

const LocationStartModal = ({ closeModal, toggleMap, myUsername, chatterId, channel }) => {
    const toggleLocationShare = useMutation(TOGGLE_LOCATION_SHARE_MUTATION)
    const createMessage = useMutation(CREATE_MESSAGE_MUTATION)
    const { data: { mapOpen } } = useQuery(LOCAL_STATE_MAP_QUERY)

    // start the location tracking
    // 'true' to be included in createLocation's isShared field
    // this is to distinguish from the unintended location in database 
    const locationHandler = async () => {
        try {
            toggleLocationShare()
            closeModal()
            toggleMap()
            !mapOpen && await createMessage({
                variables: { 
                    text: `${myUsername[0].firstName} has started sharing his/her current location`,
                    chatterId,
                    channel,
                    status: true,
                }
            })
        } catch(err) {
            throw new Error(err)
        }
    }
    return(
        <>
            <p>Are you sure you want to share your location?</p>
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

LocationStartModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    toggleMap: PropTypes.func.isRequired,
    myUsername: PropTypes.array.isRequired,
    chatterId: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
}

export default React.memo(LocationStartModal)