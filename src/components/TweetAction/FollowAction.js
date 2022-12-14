import React from "react";

const FollowAction = ({ user, followState, followingHover, onFollowClick, setFollowingHover }) => {


    return(
        <>
            <div className="recommend_contaienr_follow_box">
                {followState ? (
                    followingHover ? (
                        <button className="recommend_friend_follow_btn" onClick={() => {onFollowClick(user)}} onMouseOver={() => setFollowingHover(true)} onMouseOut={() => setFollowingHover(false)}>UnFollow</button>
                    ) : (
                        <button className="recommend_friend_follow_btn" onClick={() => {onFollowClick(user)}} onMouseOver={() => setFollowingHover(true)} onMouseOut={() => setFollowingHover(false)}>Following</button>
                    )
                ) : (
                    <button className="recommend_friend_unfollow_btn" onClick={() => {onFollowClick(user)}}>Follow</button>
                )}
            </div>
        </>
    );
}

export default FollowAction;