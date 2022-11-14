import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => {
    const iconColor = "#04AAFF";
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
                    <Link to="/profile" className="nav_link_profile">
                        <FontAwesomeIcon icon={faUser} color={iconColor} size={iconSize} />
                        <span>
                            {userObj.displayName
                            ? `${userObj.displayName}의 Profile`
                            : "Profile"}
                        </span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
} 

export default Navigation;