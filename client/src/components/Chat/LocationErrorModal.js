import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import Modal from 'react-modal';
import PropTypes from 'prop-types'
import CheckCircle from '@material-ui/icons/CheckCircle'

import { TOGGLE_LOCATION_ERROR_MUTATION, CLOSE_LOCATION_SHARE_MUTATION, CREATE_MESSAGE_MUTATION } from '../../graphql/mutation'
import '../styles/LocationWarningModal.css'

const LocationErrorModal = ({ modalQuery, errorMessage, channel }) => {
    // modal toggle
    const toggleModal = useMutation(TOGGLE_LOCATION_ERROR_MUTATION) 
    const closeLocationShare = useMutation(CLOSE_LOCATION_SHARE_MUTATION)
    const createMessage = useMutation(CREATE_MESSAGE_MUTATION)

    const locationHandler = async () => {
        try {
            closeLocationShare()
            toggleModal()
            await createMessage({
                variables: { 
                    text: errorMessage,
                    chatterId: "LocationErrorMessage",
                    channel: channel,
                    status: true,
                }
            })
            window.location.reload()
        } catch(err) {
            throw new Error(err)
        }
    }

    return(
        <Modal
          isOpen={modalQuery}
          onRequestClose={() => toggleModal()}
          contentLabel=""
          className="location-share-modal"
          ariaHideApp={false}
        >
            <p>{errorMessage}</p>
            <div className="modal-buttons">
                <CheckCircle 
                    className="check-circle" 
                    onClick={locationHandler}
                />
            </div>
        </Modal>
    )
}

LocationErrorModal.propTypes = {
    modalQuery: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
}

export default LocationErrorModal