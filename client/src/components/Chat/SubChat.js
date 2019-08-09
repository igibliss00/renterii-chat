import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import Attachment from '@material-ui/icons/Attachment'
import Location from '@material-ui/icons/MyLocation'
import Arrow from '@material-ui/icons/ArrowBack'
import { Link } from 'react-router-dom'

import { CREATE_MESSAGE_MUTATION, TOGGLE_AUTH_MODAL_MUTATION, DELETE_LOCATION_MUTATION } from '../../graphql/mutation'
import { LOCAL_STATE_MAP_QUERY, LOCAL_AUTH_MODAL_STATE_QUERY } from '../../graphql/query'
import '../styles/SubChat.css'
import LocationWarningModal from './LocationWarningModal'
import ChatMapContainer from './ChatMapContainer'
import { AUTH_ID } from '../../constants'
import TypeIndicator from './TypeIndicator'
import Message from './Message'

class SubChat extends PureComponent {
    state = {
        text: '',
        value: '',
        image: '',
        largeImage: '',
        chatterId: '',
        keycode: 13,
    }

    componentWillMount() {
        this.unsubscribe = this.props.subscribeToNewMessages()
    }

    componentDidMount() {
        document.title = 'renterii - chat'
        this.scrollToBottom()
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe()
        }
    }

    // keep the chat screen scrolled to the bottom
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    onSubmitHandler = async (createMessage, e) => {
        e.preventDefault()
        try {
            await createMessage({
                variables: {
                    text: this.state.value,
                    image: this.state.image,
                    largeImage: this.state.largeImage,
                    chatterId: this.state.chatterId,
                    channel: this.props.channel,
                    isTyping: false,
                }
            })
            this.setState({
                value: '',
                keycode: 13
            })
        } catch(err) {
            throw new Error(err)
        }
    }

    onChangeHandler = e => {
        this.setState({ value: e.target.value })
    }

    onKeypressHandler = e => {
        this.setState({ keycode: e.keyCode || e.which })
    }

    modalHandler = async (modalToggle, deleteLocation) => {
        try {
            await modalToggle()
            await deleteLocation({ 
                variables: {
                    channel: this.props.channel
                }
            })
        } catch(err) {
            throw new Error(err)
        }
    }

    uploadFile = async (e, createMessage) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'renterii')
    
        const res = await fetch('https://api.cloudinary.com/v1_1/dhtedrlv9/image/upload', {
          method: 'POST',
          body: data,
        })
        const file = await res.json()
        this.setState({ image: file.secure_url })
        this.setState({ largeImage: file.eager[0].secure_url })
        try {
            await createMessage({
                variables: {
                    image: file.secure_url,
                    largeImage: file.eager[0].secure_url,
                    chatterId: this.state.chatterId,
                    channel: this.props.channel,
                    isTyping: false
                }
            })
            this.setState({
                value: '',
                keycode: 13
            })
        } catch(err) {
            throw new Error(err)
        }
    }
    
    render() {
        //retrieve and display the chat messages
        const authId = window.localStorage.getItem(AUTH_ID)      
        const { messages } = this.props.data && this.props.data   
        const { modalToggle, createMessage, modalQuery, deleteLocation, mapToggle: { mapOpen }, members, channel } = this.props

        //get the names of the members in the chat
        const chatUsername = members && members.filter(member => member.id !== authId)
        const myUsername = members && members.filter(member => member.id === authId)
        this.setState({
            chatterId: chatUsername[0].id,
        })
        return (
            <div className="chat-wrapper">
                <Link 
                    className="back-arrow"
                    to={"/inbox/"}
                >
                    <Arrow /> 
                    <p>Back to Inbox</p>
                </Link>
                <h3>You are now chatting with {chatUsername[0].firstName}</h3>
                <div className="chat">
                    <Message 
                        messages={messages}
                        authId={authId}
                        chatterId={chatUsername[0].id}
                        channel={channel}
                    />
                    <div 
                        className="chat-scroll-dummy"
                        ref={(el) => { this.messagesEnd = el; }}
                    >
                    </div>
                </div>
                <form 
                    className="chat-input"
                    onSubmit={(e) => this.onSubmitHandler(createMessage, e)}
                >
                    <input 
                        type="text"
                        value={this.state.value}
                        onChange={this.onChangeHandler}
                        onKeyPress={this.onKeypressHandler}
                        autoFocus={true}
                        placeholder="Enter Text Here"
                    />
                    <button className="chat-button">
                        <p>Enter</p>
                    </button>
                </form>
                <div className="panels">
                    <div className="left-panel">
                        <label 
                            htmlFor="file"
                            className="custom-file-upload"
                        >
                            <Attachment />
                            <input
                                type="file"
                                id="file"
                                placeholder="Upload an image"
                                onChange={(e) => this.uploadFile(e, createMessage)}
                            />
                        </label>
                        <div className="location-share">
                            <Location 
                                className={mapOpen ? "location-on" : ""}
                                onClick={() => this.modalHandler(modalToggle, deleteLocation)} 
                            />
                            <LocationWarningModal 
                                open={modalQuery.authModalOpen}  
                                mapOpen={mapOpen}
                                myUsername={myUsername}
                                chatterId={myUsername[0].id}
                                channel={channel}
                            />
                        </div>
                    </div>
 
                </div>
                {mapOpen && <ChatMapContainer channel={this.props.channel} />} 
                <TypeIndicator 
                    keycode={this.state.keycode} 
                    myUsername={myUsername && myUsername[0].firstName}
                    channel={channel}
                    chatterId={this.state.chatterId}
                />
            </div>
            )
        }
    }

SubChat.propTypes = {
    channel: PropTypes.string,
    members: PropTypes.array,
    data: PropTypes.object.isRequired
}
export default compose(
    graphql(LOCAL_AUTH_MODAL_STATE_QUERY, { name: 'modalQuery'}),
    graphql(TOGGLE_AUTH_MODAL_MUTATION, { name: 'modalToggle'}),
    graphql(CREATE_MESSAGE_MUTATION, { name: 'createMessage'}),
    graphql(LOCAL_STATE_MAP_QUERY, { name: 'mapToggle'}),
    graphql(DELETE_LOCATION_MUTATION, { name: 'deleteLocation'}),
)(SubChat)