import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'react-apollo-hooks'
import ReactMapGL, { NavigationControl, Marker, FullscreenControl, GeolocateControl, LinearInterpolator } from 'react-map-gl'
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import { api } from './apikey'
import '../styles/ChatMap.css'
import PinIcon from './PinIcon'
// import SelectedPopup from './SelectedPopup'
import { LOCAL_LOCATION_SHARE_STATE_QUERY, LOCAL_LOCATION_ERROR_STATE_QUERY } from '../../graphql/query'
import { CREATE_LOCATION_MUTATION, TOGGLE_LOCATION_ERROR_MUTATION } from '../../graphql/mutation'
import Spinner from '../../util/Spinner'
import { AUTH_ID } from '../../constants'
import LocationErrorModal from '../Chat/LocationErrorModal'

const INITIAL_VIEWPORT = {
    latitude: 43.761539,
    longitude: -79.411079,
    zoom: 11,
    width: "500px",
    height: "300px",
    bearing: 0,
    pitch: 0
}

const ChatMap = ({ data, channel, subscribeToNewMessages }) => {
    const [viewport, setViewport] = useState()
    const [geoLocationError, setGeoLocationError] = useState()
    const [viewportChange, setViewportChange] = useState(INITIAL_VIEWPORT)
    const authId = window.localStorage.getItem(AUTH_ID)

    // map size
    const mobileSize = useMediaQuery("(max-width: 650px)")
    const width = useMediaQuery("(max-width: 520px)") ? "100vw" : "100%"

    // toggle query for isShared
    const { data: locationShare, error, loading } = useQuery(LOCAL_LOCATION_SHARE_STATE_QUERY)

    // modal toggle for the location error
    const toggleModal = useMutation(TOGGLE_LOCATION_ERROR_MUTATION) 

    // save user's own position to the database
    const createLocation = useMutation(CREATE_LOCATION_MUTATION)

    // query for the location error modal
    const { data: modalQuery } = useQuery(LOCAL_LOCATION_ERROR_STATE_QUERY)

    // subscribeToMore from ChatMapContainer
    useEffect(() => {
        subscribeToNewMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        try {
            createLocation({
                variables: {
                    latitude: !!viewport && viewport.latitude, 
                    longitude: !!viewport && viewport.longitude,
                    channel,
                    isShared: locationShare.locationShare
                }
            })
        } catch(err) {
            throw new Error(err)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[viewport])

    let geolocation;
    useMemo(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        geolocation = setInterval(() => {
            if(locationShare.locationShare === false ) {
                clearInterval(geolocation)
                return;
            } else if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(showPosition, showLocationError)
            } 
        }, 5000);
    }, [locationShare.locationShare, setViewport])
 
    // 1st callback from geolocation API
    const showPosition = position => {
        const { latitude, longitude } = position.coords;
        setViewport({ latitude, longitude })
    }

    // 2nd callback from geolocation API
    const showLocationError = error => {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                clearInterval(geolocation)  
                setGeoLocationError("User's browser denied the request for Geolocation.")
                modalHandler()
                break;
            case error.POSITION_UNAVAILABLE:
                clearInterval(geolocation)
                setGeoLocationError("Location information is unavailable.")
                modalHandler()
                break;
            case error.TIMEOUT:
                clearInterval(geolocation)
                setGeoLocationError("The request to get user location timed out.")
                modalHandler()
                break;
            case error.UNKNOWN_ERROR:
                clearInterval(geolocation)
                setGeoLocationError("An unknown error occurred.")
                modalHandler()
                break;
            default:
                clearInterval(geolocation)
                setGeoLocationError("An unknown geolocation error occurred.")
                modalHandler()
        }
    }

    // modal handler location error
    const modalHandler = () => {
        try {
            toggleModal()
        } catch(err) {
            throw new Error(err)
        }
    }

    // popup handler for individual pin
    const handleSelectCurrentPin = userPosition => {
        console.log("current pin selected!")
    }

    // modal for gelocation error
    if(modalQuery.locationError) {
        return (
            <LocationErrorModal 
                modalQuery={modalQuery.locationError} 
                errorMessage={geoLocationError} 
                channel={channel}
            />
        )
    }
    if(loading || !viewport) return <Spinner />
    if(error) return <p>Location Share Error</p>
    return(
        <ReactMapGL
            {...viewportChange}
            width={width}
            height={300}
            doubleClickZoom={true}
            zoom={viewportChange.zoom ? viewportChange.zoom : 11}
            transitionDuration={100}
            transitionInterpolator={new LinearInterpolator()}
            touchZoom={true}
            scrollZoom={!mobileSize}
            mapStyle="mapbox://styles/mapbox/streets-v10"
            mapboxApiAccessToken={api}
            onViewportChange={newViewport => setViewportChange(newViewport)}
        >
            {/* Navigation Control */}
            <div className='navigationControl'>
                <NavigationControl 
                    onViewportChange={newViewport => setViewportChange(newViewport)}
                />
                <FullscreenControl 
                    container={document.querySelector('body')}
                />
                <GeolocateControl 
                    positionOptions={{enableHighAccuracy: true}}
                    trackUserLocation={true}
                    onViewportChange={newViewport => setViewportChange(newViewport)}
                    showUserLocation={false}
                />
            </div>
 
            {data.locations.user.id !== authId ? 
                <Marker
                    latitude={data.locations.latitude}
                    longitude={data.locations.longitude}
                    offsetLeft={-19}
                    offsetTop={-37}
                >
                    <PinIcon
                        onClick={() => handleSelectCurrentPin()}
                        size={40}
                        color={"red"}
                    />  
                </Marker>
                : 
                <Marker
                    latitude={data.locations.latitude}
                    longitude={data.locations.longitude}
                    offsetLeft={-19}
                    offsetTop={-37}
                >
                    <PinIcon
                        onClick={() => handleSelectCurrentPin()}
                        size={40}
                        color={"green"}
                    />  
                </Marker>  
            }
        </ReactMapGL>
    )
}

ChatMap.propTypes = {
    data: PropTypes.object,
    channel: PropTypes.string.isRequired,
    subscribeToNewMessages: PropTypes.func.isRequired,
}

export default React.memo(ChatMap)

// width={width}
// height={300}
// onViewportChange={newViewport => setViewportChange(newViewport)}
