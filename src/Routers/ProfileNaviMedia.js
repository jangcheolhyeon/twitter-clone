import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const ProfileNaviMedia = () => {
    return(
        <>
            <div className="media_container">
                <div className="media_content_img">
                    <FontAwesomeIcon icon={faCamera} />
                </div>
                <div className="media_content_message">
                    <span className="message_header">Lights, camera ... attachments!</span>
                    <span className="text">When you send Tweets with photos or videos in them, they will show up here.</span>
                </div>
            </div>
        </>
    )
}

export default ProfileNaviMedia;