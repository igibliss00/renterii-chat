import React from 'react'
import { GoogleLogin } from 'react-google-login'
import { useMutation } from 'react-apollo-hooks'

import { OAUTH_TOKEN, AUTH_TOKEN } from '../../constants'
import { OAUTH_MUTATION } from '../../graphql/mutation'
import '../styles/GoogleAuth.css'

const GoogleAuth = props => {
    const authenticate = useMutation(OAUTH_MUTATION)
    const onSuccess = async googleUser => {
        const idToken = await googleUser.getAuthResponse().id_token
        localStorage.setItem(OAUTH_TOKEN, idToken)
        try {
            let authResults = await authenticate()
            await localStorage.setItem(AUTH_TOKEN, authResults.data.googleLogin.token)
            await localStorage.removeItem(OAUTH_TOKEN)
            props.history.push('/') 
        } catch(err) {
            throw new Error("Authentication error", err)
        }
    }

    const responseGoogle = (response) => {
        console.log(response);
    }

    return (
        <div className="google-auth">
            <GoogleLogin 
                clientId="625362756605-flmp1iqg8foov1piimbhl97cqq421k2e.apps.googleusercontent.com"
                onSuccess={onSuccess}
                onFailure={responseGoogle}
                isSignedIn={true}
            />
        </div>
    )
}

export default React.memo(GoogleAuth)