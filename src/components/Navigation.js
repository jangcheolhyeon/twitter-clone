import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser, faUserCircle, faHouse, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import TweetModal from "components/TweetModal";
import { getAuth, signOut } from "firebase/auth";


const Navigation = ({ userObj, retweetState, parentBundle, RetweetContent, setRetweetContent }) => {
    const iconColor = "white";
    const iconSize = "2x";
    const [tweetModal, setTweetModal] = useState(false);
    const [logoutClicked, setLogoutClicked] = useState(false);
    const userInfoRef = useRef();

    const auth = getAuth();
    const navi = useNavigate();

    const onLogout = () => {
        signOut(auth);
        navi('/');
    }

    const onTweetModalToggle = () => {
        setTweetModal((prev) => !prev);
    }

    const userInfoClicked = () =>{
        setLogoutClicked((prev) => !prev)
    }

    const onClickOutSide = (event) => {
        console.log(event.path.includes(userInfoRef.current));
        console.log(userInfoRef.current);
        if(logoutClicked && !event.path.includes(userInfoRef.current)){
            userInfoClicked();
        };

    }

    useEffect(() => {
        document.addEventListener("mousedown", onClickOutSide);
        return () => {
            document.removeEventListener("mousedown", onClickOutSide);
        }
    }, [logoutClicked])

    return(
        <>
            {tweetModal && <TweetModal userObj={userObj} onTweetModalToggle={onTweetModalToggle} retweetState={retweetState} parentBundle={parentBundle} RetweetContent={RetweetContent} setRetweetContent={setRetweetContent} />}
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

                    <div className="current_user_info_container" onClick={userInfoClicked} ref={userInfoRef}>
                        {logoutClicked && (
                            <div className="user_info_click">
                                <span onClick={onLogout}>Logout</span>
                            </div>
                        )}
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