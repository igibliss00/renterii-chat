import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import Modal from 'react-modal';
import PropTypes from 'prop-types'

import { TOGGLE_AUTH_MODAL_MUTATION, CLOSE_AUTH_MODAL_MUTATION, TOGGLE_MAP_MUTATION } from '../../graphql/mutation'
import '../styles/LocationWarningModal.css'
import LocationStartModal from './LocationStartModal'
import LocationStopModal from './LocationStopModal'

const LocationWarningModal = ({ open, mapOpen, myUsername, chatterId, channel }) => {
    // modal toggle
    const toggleModal = useMutation(TOGGLE_AUTH_MODAL_MUTATION) 
    const closeModal = useMutation(CLOSE_AUTH_MODAL_MUTATION)

    // map toggle
    const toggleMap = useMutation(TOGGLE_MAP_MUTATION)
    return(
        <Modal
          isOpen={open}
          onRequestClose={() => toggleModal()}
          contentLabel=""
          className="location-share-modal"
          ariaHideApp={false}
        >
            {mapOpen ? 
                <LocationStopModal 
                    closeModal={closeModal}
                    toggleMap={toggleMap}
                    myUsername={myUsername}
                    chatterId={chatterId}
                    channel={channel}    
                />
                :
                <LocationStartModal 
                    closeModal={closeModal}
                    toggleMap={toggleMap} 
                    myUsername={myUsername}
                    chatterId={chatterId}
                    channel={channel}
                />
            }
        </Modal>
    )
}

LocationWarningModal.propTypes = {
    open: PropTypes.bool.isRequired,
    mapOpen: PropTypes.bool.isRequired,
    myUsername: PropTypes.array.isRequired,
    chatterId: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
}

export default React.memo(LocationWarningModal)