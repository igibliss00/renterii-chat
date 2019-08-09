import { AUTH_ID } from '../../constants'

const ChatMembers = ({ channel, setBorrowerId }) => {
    const authId = window.localStorage.getItem(AUTH_ID)
    const { members } = channel
    const member = members && members.filter(member => {
        return member.id !== authId 
    })

    if(member[0]) {
        const { firstName } = member[0]
        return (
            firstName
        )
    }
    return null    
}

export default ChatMembers