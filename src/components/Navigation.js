import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser, faUserCircle, faHouse } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => {
    const iconColor = "white";
    const iconSize = "2x";

    return(
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
                        <Link to="/" className="nav_link">
                            <FontAwesomeIcon icon={faUser} color={iconColor} size={iconSize} />
                            <span className="nav_link">Profile</span>
                        </Link>
                    </div>
                </li>


                <div className="navi_tweet_container">
                    <div className="tweet_btn">
                        <span>Tweet</span>
                    </div>
                </div>

                {/* <li>
                    <Link to="/profile" className="nav_link_profile">
                        <FontAwesomeIcon icon={faUser} color={iconColor} size={iconSize} />
                        <span>
                            {userObj.displayName
                            ? `${userObj.displayName}의 Profile`
                            : "Profile"}
                        </span>
                    </Link>
                </li> */}

                <div className="current_user_info_container">
                    <FontAwesomeIcon icon={faUserCircle} color={iconColor} size={iconSize} />
                    <span className="current_user_info">
                        {userObj.displayName
                        ? `${userObj.displayName}`
                        : null}
                    </span>
                </div>
            </ul>
        </nav>
    );
} 

export default Navigation;