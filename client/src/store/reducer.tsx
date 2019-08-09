import { SEARCH_POST, BOOKING_ID, SELECT_PIN, SELECT_YOUR_PIN, SELECT_CARD, SELECT_CHANNEL } from '../constants'

export default function reducer(state = {}, action: any) {
    switch (action.type) {
        case SEARCH_POST:
            return {
                ...state,
                searchTerm: action.payload
            }
        case BOOKING_ID:
            return {
                ...state,
                bookingId: action.payload
            }
        case SELECT_PIN:
            const selected = action.payload
            return {
                ...state,
                myPin: null,
                selectedCard: null,
                selectedCardPin: false,
                selectedPin: selected
            }
        case SELECT_YOUR_PIN:
            const  currentPositionPin = { ...action.payload, displayCurentPositionPin: true}
            return {
                ...state,
                myPin: currentPositionPin,
                selectedCard: null,
                selectedPin: null,
                selectedCardPin: false
            }
        case SELECT_CARD:
            const selectedCard = action.payload
            return {
                ...state,
                myPin: null,
                selectedPin: null,
                selectedCardPin: true,
                selectedCard
            }
        case SELECT_CHANNEL: {
            const { channel, members } = action.payload
            return {
                ...state,
                channel,
                members
            }
        }
        default:
            return state
    }
}