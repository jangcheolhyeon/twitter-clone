import React from "react";

const RecommendFriend = ({ userPhoto, userName }) => {
    return(
        <li className="recommend_item">
            <div className="user_image_container">
                <img src={userPhoto} />
            </div>
            <div className="user_display_name">
                <span>{userName}</span>
            </div>
            <div>

            </div>
        </li>
    );
}

export default RecommendFriend;