import AUthForm from "components/AuthForm";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from 'react';

const Auth = () => {
        const onSnsClick = async (event) => {
        const {target : { name }} = event;

        const auth = getAuth();
        let provider;

        // OAUTH 인증
        if(name === 'google'){
            provider = new GoogleAuthProvider();
        } else if(name === 'github'){
            provider = new GithubAuthProvider();
        }
        await signInWithPopup(auth, provider);
    }

    return(
        <div>    
            <AUthForm />      
            <div>
                <button onClick={onSnsClick} name="google">Continue with Google</button>
                <button onClick={onSnsClick} name="github">Continue with Github</button>
            </div>
        </div>
    );
}

export default Auth;