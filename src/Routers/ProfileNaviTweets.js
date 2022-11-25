import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEllipsis, faUserPlus, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import RecommendFriend from "components/RecommendFriend";
import Tictoc from "components/Tictoc";

const ProfileNaviTweets = ({ usersProfile, userObj, tictoc, setTweetDetail, setToastAlert, setToastText }) => {
    if(tictoc.length === 0){
        return null;
    }

    return(
        <>
            {
                tictoc.map((element) => {
                    return <Tictoc key={element.createdAt} tictoc={element} isOwner={true} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail}/>
                })
            }

            <div className='profile_follow_recommend'>
                <span>Who to follow</span>
                
                <div className="recommend_list_container">
                    <ul className="recommend_list">
                        {usersProfile.filter(element => element.userId !== userObj.uid).map((element) => {
                            return(
                                <>
                                    <RecommendFriend
                                        key={element.userId} user={element} 
                                    />
                                    <span>asdlfnsaldk</span>
                                </>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default ProfileNaviTweets;