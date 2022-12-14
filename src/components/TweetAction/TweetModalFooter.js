import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";



const TweetModalFooter = ({ onFileChange, onTweetBtn, division }) => {
    return(
        <>
            <div className="tweet_modal_container_footer">
                    <label htmlFor={division}>
                        <FontAwesomeIcon icon={faImage} />
                    </label>
                    <input type="file" id={division} accept="image/*" onChange={onFileChange} />

                    <button onClick={onTweetBtn}>Tweet</button>
                </div>  
        </>
    );
}

export default TweetModalFooter;