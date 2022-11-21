import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faImage } from "@fortawesome/free-solid-svg-icons";

const TweetModal = ({ userObj, onTweetModalToggle }) => {
    return(
        <div className="tweet_modal_background">
            <div className="tweet_modal_container">
                <div className="delete_container" onClick={onTweetModalToggle}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>

                <div className="tweet_modal_content_container">
                    <div className="user_img_container">
                        <img src={userObj.photoURL} /> 
                    </div>
                    <div className="user_tweet_container">
                        <div>
                            <input type="text" placeholder="what's happening" className="tweet_modal_tweet_text" />
                        </div>
                    </div>
                </div>

                <div className="tweet_modal_container_footer">
                    <FontAwesomeIcon icon={faImage} />
                    <button>Tweet</button>
                </div>  
            </div>
        </div>
    )
}

export default TweetModal;