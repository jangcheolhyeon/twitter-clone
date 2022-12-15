import React from "react";
import FollowAction from "components/TweetAction/FollowAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const EmailHoverInTweet = ({ user, userObj, followState, followingHover, setFollowingHover, onFollowClick }) => {
    return(
        <>
            <div className="user_info_hover_top_container">
                <div className="user_info_hover_img_container">
                    {user.userImage ? (
                        <img src={user.userImage} alt="user Image" />
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser}/>
                    )}
                    
                </div>
                {user.userId === userObj.uid ? 
                    (
                        <>
                            <div className="user_info_hover_current_user">
                                <button>me</button>
                            </div>
                        </>
                    ) : (
                        <FollowAction user={user} followState={followState} followingHover={followingHover} onFollowClick={onFollowClick} setFollowingHover={setFollowingHover} />
                    )}
            </div>
        </>
    );
}

export default EmailHoverInTweet