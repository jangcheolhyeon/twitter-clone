import { db } from "fbase";
import { doc, updateDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";


const RecommendFriend = ({ user }) => {
    const [followState, setFollowState] = useState(false);
    const [followingHover, setFollowingHover] = useState(false);

    const onFollowClick = () => {
        setFollowState(prev => !prev);

        
    }
    return(
        <li className="recommend_item">
            <div className="user_image_container">
                <img src={user.userImage} />
            </div>
            <div className="user_display_name">
                <span>{user.displayName}</span>
            </div>
            <div className="recommend_contaienr_follow_box">
                {followState ? (
                    followingHover ? (
                        <button className="recommend_friend_follow_btn" onClick={onFollowClick} onMouseOver={() => setFollowingHover(true)} onMouseOut={() => setFollowingHover(false)}>UnFollow</button>
                    ) : (
                        <button className="recommend_friend_follow_btn" onClick={onFollowClick} onMouseOver={() => setFollowingHover(true)} onMouseOut={() => setFollowingHover(false)}>Following</button>
                    )
                ) : (
                    <button className="recommend_friend_unfollow_btn" onClick={onFollowClick}>Follow</button>
                )}
            </div>
        </li>
    );
}

export default RecommendFriend;