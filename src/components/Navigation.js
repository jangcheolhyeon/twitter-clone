import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser, faUserCircle, faHouse, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import TweetModal from "components/TweetModal";


const Navigation = ({ userObj }) => {
    const iconColor = "white";
    const iconSize = "2x";
    const [tweetModal, setTweetModal] = useState(false);

    const onTweetModalToggle = () => {
        setTweetModal((prev) => !prev);
    }

    return(
        <>
            {tweetModal && <TweetModal userObj={userObj} onTweetModalToggle={onTweetModalToggle}/>}
            <nav>
                <ul className="nav_link_container">
                    <li>
                        <Link to="/" className="nav_link_home">
                            <FontAwesomeIcon icon={faTwitter} color={iconColor} size={iconSize} />
                        </Link>
                    </li>
                    
                    <li>
                        <div className="li_container">
                            <Link to="/" className="nav_link">
                                <FontAwesomeIcon icon={faHouse} color={iconColor} size={iconSize} />
                                <span className="nav_link">HOME</span>
                            </Link>
                        </div>
                    </li>

                    <li>
                        <div className="li_container">
                            <Link to="/profile" className="nav_link">
                                <FontAwesomeIcon icon={faUser} color={iconColor} size={iconSize} />
                                <span className="nav_link">Profile</span>
                            </Link>
                        </div>
                    </li>


                    <div className="navi_tweet_container" onClick={onTweetModalToggle}>
                        <div className="tweet_btn">
                            <span>Tweet</span>
                        </div>
                    </div>

                    <div className="current_user_info_container">
                        <FontAwesomeIcon icon={faUserCircle} color={iconColor} size={iconSize} />
                        <span className="current_user_info">
                            {userObj.displayName
                            ? `${userObj.displayName}`
                            : null}
                        </span>
                        <FontAwesomeIcon icon={faEllipsis} className='three-dots-icon' />
                    </div>
                </ul>
            </nav>
        </>
    );
} 

export default Navigation;