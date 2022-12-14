import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Tweet from "components/Tweet";

const ShowMediaInProfile = ({ usersProfile, userObj, myTweetList, setToastAlert, setToastText, setTweetDetail, currentPage, setCurrentPage }) => {
    const [attachmentMyTweetList, setAttachmentMyTweetList] = useState([]);

    useEffect(() => {
        setAttachmentMyTweetList(myTweetList.filter(element => {
            return element.attachmentUrl !== "";
        }))
    }, [])

    return(
    <>
            {myTweetList.length === 0 || attachmentMyTweetList.length === 0 ? (
                <div className="media_container">
                    <div className="media_content_img">
                        <FontAwesomeIcon icon={faCamera} />
                    </div>
                    <div className="media_content_message">
                        <span className="message_header">Lights, camera ... attachments!</span>
                        <span className="text">When you send Tweets with photos or videos in them, they will show up here.</span>
                    </div>
                </div>
            ) : (
                <>
                    {attachmentMyTweetList.map(element => {
                        return <Tweet 
                                    key={element.createdAt} 
                                    tictoc={element} 
                                    isOwner={true}
                                    userObj={userObj}
                                    usersProfile={usersProfile}
                                    setToastAlert={setToastAlert}
                                    setToastText={setToastText}
                                    setTweetDetail={setTweetDetail}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                /> 
                    })}
                </>
            )}
        </>
    )
}

export default ShowMediaInProfile;