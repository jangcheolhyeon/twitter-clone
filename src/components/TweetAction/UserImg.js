import React, { useRef } from "react";
import UserInfoHover from "components/TweetAction/UserInfoHover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const UserImg = ({ tictoc, userImgHover, userPhoto, userObj, usersProfile, setUsersProfile, setUserInfoHover, lastTweet }) => {
    const timerRef = useRef();
    const tweetWriteUser = usersProfile.filter(element => element.userId === tictoc.userId)[0];

    return(
        <>
            <div className="tweet_user_photo_container">
                {userPhoto ? (
                    <>
                        <img src={userPhoto} alt="user image" className={userImgHover ? 'user_photo_image activing_user_photo_image' : 'user_photo_image'}
                            onMouseOver={() => { setUserInfoHover(true); }} 
                            onMouseOut={() => { timerRef.current = setTimeout(() => {
                                setUserInfoHover(false);
                            }, 500) }}
                        />
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faCircleUser} className={userImgHover ? 'user_photo_image activing_user_photo_image' : 'user_photo_image'}
                            onMouseOver={() => { setUserInfoHover(true); }} 
                            onMouseOut={() => { timerRef.current = setTimeout(() => {
                                setUserInfoHover(false);
                            }, 500) }}
                        />
                    </>
                )}

                {userImgHover && 
                    <UserInfoHover userInfo={tweetWriteUser} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} timerRef={timerRef} setUserInfoHover={setUserInfoHover} isUserImgHover={true} lastTweet={lastTweet} isAttachmentUrl={tictoc.attachmentUrl} />
                }
            </div>    
        </>
    );
}

export default UserImg;