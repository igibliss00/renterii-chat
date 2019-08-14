import React, { useState, useContext } from 'react'
import {Trail} from 'react-spring/renderprops'

import Context from '../../../store/context'
import '../../styles/NewChannelForm.css'
import { delay } from 'q';

const NewChannelForm = () => {
    const [ channel, setChannel ] = useState<string>('')
    const { state } = useContext<any>(Context)

    const formArr = [
        {
            type: 'text',
            id: 'text',
            placeholder: 'text'
        },
    ]
    return (
            <div className="new-channel">
                <form className="new-channel-form">
               
                </form>
            </div>     
    )
}

export default NewChannelForm

{/* <label style={props} htmlFor='text' >
<input 
    type={type} 
    id={id}
    value={channel}
    placeholder={placeholder}
    onChange={e => { setChannel(e.target.value) }}               
/>
</label> */}