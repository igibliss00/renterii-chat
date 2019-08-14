import React from 'react'
import { Popup } from 'react-map-gl'
import Typography from "@material-ui/core/Typography"

const SelectedPopup = props => {
    return (
        <>
            <Popup
                anchor="bottom"
                latitude={props.info.latitude}
                longitude={props.info.longitude}
                closeOnClick={true}
                offsetTop={-35}
                onClose={(() => props.onClose(null))}
            >
                <Typography>
                    {props.info.displayCurentPositionPin
                    ? "Current location" 
                    : (
                        [props.info.title, '  ' , "$", props.info.price]
                      )
                    }
                </Typography> 
            </Popup>
        </>
    )
}

export default React.memo(SelectedPopup)