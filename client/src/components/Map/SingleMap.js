import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl'
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import { api } from './apikey'
import PinIcon from './PinIcon'
import Context from '../../store/context'
import { SELECT_PIN, SELECT_YOUR_PIN } from '../../constants'
import SelectedPopup from './SelectedPopup'
import '../styles/SingleMap.css'

const SingleMap = props => {
  const { state, dispatch } = useContext(Context)
  const [userPosition, setUserPosition] = useState(null)
  const mobileSize = useMediaQuery("(max-width: 650px)")

  //map viewport setup
  const { latitude, longitude, id } = props.post && props.post

  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom: 11,
    bearing: 0,
    pitch: 0
  })
  
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      setUserPosition({ latitude, longitude })
    })
  }
  
  // popup handler for individual pin
  const handleSelectPin = post => {
    dispatch({ type: SELECT_PIN, payload: post })
  }

  // popup handler for your current location 
  const handleSelectCurrentPin = post => {
    dispatch({ type: SELECT_YOUR_PIN,  payload: post })
  }
  const info = state.selectedPin || state.myPin
  return (
    <div>
      <ReactMapGL
        width={'calc(100%'}
        height={400}
        {...viewport}
        zoom={viewport.zoom ? viewport.zoom : 11}
        scrollZoom={!mobileSize}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        mapboxApiAccessToken={api}
        onViewportChange={newViewport => setViewport(newViewport)}
      >
        {/* Navigation Control */}
        <div className={props.classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>

        {/* user's current position */}     
        {userPosition && (
          <>
            <Marker
              latitude={userPosition.latitude}
              longitude={userPosition.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon
                onClick={() => handleSelectCurrentPin(userPosition)}
                size={40}
                color={"green"}
              />  
            </Marker>
            {info && <SelectedPopup info={info} />} 
          </>
        )}
        {/* Markers for individual posting */}
        
            <div key={id}>
              <Marker
                longitude={longitude}
                latitude={latitude}
                offsetLeft={-19}
                offsetTop={-37}
              >
                <PinIcon
                  onClick={() => handleSelectPin(props.post)}
                  size={40}
                  color={"red"}
                /> 
              </Marker>
              {/* popups for markers */}
              {info && <SelectedPopup info={info} onClose={() => handleSelectPin()} />} 
            </div>
      </ReactMapGL>
    </div>
  )
}

const styles = {
    root: {
      display: "flex"
    },
    rootMobile: {
      display: "flex",
      flexDirection: "column-reverse"
    },
    navigationControl: {
      position: "absolute",
      top: 0,
      left: 0,
      margin: "1em"
    },
    popupImage: {
      padding: "0.4em",
      height: 200,
      width: 200,
      objectFit: "cover"
    }
  }

SingleMap.propTypes = {
  latitude: PropTypes.string.isRequired,
  longitude: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default withStyles(styles)(SingleMap)