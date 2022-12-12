import React from "react";
import RecommendFriend from "components/RecommendFriend";

const UserInfoHover = ({ userInfo, userObj, usersProfile, setUsersProfile, timerRef, setUserInfoHover, isUserImgHover }) => {

    return(
        <>
            <div className={isUserImgHover ? 'user_info_hover_container hover_user_img' : 'user_info_hover_container hover_email'}
                onClick={ (event) => event.stopPropagation() } 
                onMouseOver={() => {
                    clearTimeout(timerRef.current);
                    setUserInfoHover(true); 
                }}
                onMouseOut={() => { setUserInfoHover(false); }}
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
        </>
    );
}

export default UserInfoHover;