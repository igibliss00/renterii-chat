import { createContext } from 'react'

interface MyContextType {
    latlng?: any,
    searchTerm?: any,
    bookingId?: any,
    myPin?: any,
    selectedPin?: any,
    selectedCard?: any, 
    selectedCardPin?: any,
    members?: string[],
    channel?: string,
    menu?: any,
    authDelay: boolean,
}

const Context = createContext<MyContextType>({
    latlng: null,
    searchTerm: null,
    bookingId: null,
    myPin: null,
    selectedPin: null,
    selectedCard: null,
    // this is a dummy value so that when a card is clicked selectedCard has to be assigned false to prevent infinite loop
    // but a truthy dummy value is still needed to trigger the pin itself. 
    selectedCardPin: null,
    members: [],
    channel: '',
    menu: null,
    authDelay: false,
})

export default Context