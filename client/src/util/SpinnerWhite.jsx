import React from 'react'
import '../components/styles/SpinnerWhite.css'

const Spinner = () => {
    return (
        <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>    
    )
}

export default Spinner