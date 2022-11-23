import AuthForm from "components/AuthForm";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";


const Auth = ({ userObj, usersProfile }) => {
        const onSnsClick = async (event) => {
        const {target : { name }} = event;

        const auth = getAuth();
        let provider;

        if(name === 'google'){
            provider = new GoogleAuthProvider();
        } else if(name === 'github'){
            provider = new GithubAuthProvider();
        }
        await signInWithPopup(auth, provider);
    }

    return(
        <div className="authContainer"> 
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="3x" className="tweetter_icon" /> 
            <AuthForm userObj={userObj} usersProfile={usersProfile} />      
            <div className="authBtns">
                <button onClick={onSnsClick} name="google" className="authBtn">
                    Continue with Google <FontAwesomeIcon icon={faGoogle} />
                </button>
                <button onClick={onSnsClick} name="github" className="authBtn">
                    Continue with Github <FontAwesomeIcon icon={faGithub} />
                </button>
            </div>
        </div>
    );
}

export default Auth;