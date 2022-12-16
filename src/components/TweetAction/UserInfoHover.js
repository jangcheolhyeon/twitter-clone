import React, { useEffect, useState } from "react";
import RecommendFriend from "components/Navigation/RecommendFriend";

const UserInfoHover = ({ userInfo, userObj, usersProfile, setUsersProfile, timerRef, setUserInfoHover, isUserImgHover, lastTweet, isAttachmentUrl }) => {
    const [isLastTweet, setIsLastTweet] = useState();

    useEffect(() => {
        setIsLastTweet(lastTweet);
    }, [])   

    return(
        <>
            {isLastTweet && isAttachmentUrl === '' ? (
                <div className={isUserImgHover ? 'user_info_hover_container last_tweet_user_img_hover' : 'user_info_hover_container last_tweet_user_email_hover'}
                    onClick={ (event) => event.stopPropagation() } 
                    onMouseOver={() => {
                        clearTimeout(timerRef.current);
                        setUserInfoHover(true); 
                    }}
                    onMouseOut={() => { setUserInfoHover(false); }} // height 160px;
                >

                    <div>
                        <RecommendFriend user={userInfo} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} emailHoverState={true} />
                    </div>

                    <div className="user_info_hover_mid_container">
                        <span>{userInfo.displayName}</span>
                        <span className="user_info_hover_container_gray_text">@{userInfo.email.split('@')[0]}</span>
                    </div>

                    <div className="user_info_hover_bottom_container">
                        <span>{userInfo.following.length}<span className="user_info_hover_container_gray_text">Following</span></span>
                        <span className="second_text">{userInfo.follower.length}<span className="user_info_hover_container_gray_text">Followers</span></span>
                    </div>

                </div>
            ) : (
                <div className={isUserImgHover ? 'user_info_hover_container hover_user_img' : 'user_info_hover_container hover_email'}
                    onClick={ (event) => event.stopPropagation() } 
                    onMouseOver={() => {
                        clearTimeout(timerRef.current);
                        setUserInfoHover(true); 
                    }}
                    onMouseOut={() => { setUserInfoHover(false); }} // height 160px;
                >

                    <div>
                        <RecommendFriend user={userInfo} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} emailHoverState={true} />
                    </div>

                    <div className="user_info_hover_mid_container">
                        <span>{userInfo.displayName}</span>
                        <span className="user_info_hover_container_gray_text">@{userInfo.email.split('@')[0]}</span>
                    </div>

                    <div className="user_info_hover_bottom_container">
                        <span>{userInfo.following.length}<span className="user_info_hover_container_gray_text">Following</span></span>
                        <span className="second_text">{userInfo.follower.length}<span className="user_info_hover_container_gray_text">Followers</span></span>
                    </div>

                </div>
            )}
        </>
    );
}

export default UserInfoHover;