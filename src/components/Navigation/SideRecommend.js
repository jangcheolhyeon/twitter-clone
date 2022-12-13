import React from "react";
import RecommendFriend from "components/Navigation/RecommendFriend";

const SideRecommend = ({ usersProfile, userObj, setUsersProfile }) => {

    return(
        <div className="recommend_container">
            <div className="recommend_container_content">
                <div className="recommend_header_container">
                    <h3>Who to follow</h3>
                </div>

                <ul className="recommend_list">
                    {usersProfile.filter(element => element.userId !== userObj.uid).map((element) => {
                        return(
                            <RecommendFriend 
                                key={element.userId} user={element} usersProfile={usersProfile} userObj={userObj} setUsersProfile={setUsersProfile} emailHoverState={false}
                            />
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}

export default SideRecommend;