import React, { useState } from 'react';
import Modal from 'react-modal';
import { useMutation } from 'react-apollo-hooks'
import Close from '@material-ui/icons/Close'

import Auth from './Auth'
import '../styles/SigninRequired.css'
import { TOGGLE_AUTH_MODAL_MUTATION, CLOSE_AUTH_MODAL_MUTATION } from '../../graphql/mutation'

 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement')
 
const SigninRequired = props => {
    const toggleAuthModal = useMutation(TOGGLE_AUTH_MODAL_MUTATION) 
    const closeAuthModal = useMutation(CLOSE_AUTH_MODAL_MUTATION) 
    const [path, setPath] = useState('/login')

    return (
      <div>
        <Modal
          isOpen={props.open}
          onRequestClose={() => toggleAuthModal()}
          contentLabel=""
          className="auth-modal"
        >
          <Close 
            className="modal-close-btn"
            onClick={() => closeAuthModal()}
          />
          {path ==='/login' && <button className="auth-toggle-btn" onClick={() => setPath('/signup') }>Sign Up</button> }
          {path === '/signup' && <button className="auth-toggle-btn" onClick={() => setPath('/login') }>Login</button> }
          <Auth path={path} />
        </Modal>
      </div>
    );
  }

 
export default React.memo(SigninRequired)
