import React from "react";
import RecommendFriend from "components/RecommendFriend";

const SideRecommend = ({ usersProfile }) => {
    return(
        <div className="recommend_container">
            <div className="recommend_container_content">
                <div className="recommend_header_container">
                    <h3>Who to follow</h3>
                </div>

                <ul className="recommend_list">
                    {usersProfile.map((element) => {
                        return(
                            <RecommendFriend 
                                key={element.userId} userPhoto={element.userImage} userName={element.displayName} 
                            />
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}

export default SideRecommend;