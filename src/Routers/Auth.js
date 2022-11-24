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
            <div className="twitter_image">
                <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="10x" className="tweetter_icon" /> 
            </div>
            <div className="init_page_login_form_container">
                <div className="login_form">
                    <AuthForm userObj={userObj} usersProfile={usersProfile} />      
                </div>
                <div className="authBtns">
                    <button onClick={onSnsClick} name="google" className="authBtn googleAuth">
                        <FontAwesomeIcon icon={faGoogle} /><span>Continue with Google</span>
                    </button>
                    <button onClick={onSnsClick} name="github" className="authBtn githubAuth">
                        <FontAwesomeIcon icon={faGithub} /><span>Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );

}

export default Auth;