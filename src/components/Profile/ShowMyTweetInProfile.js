import React from "react";
import RecommendFriend from "components/Navigation/RecommendFriend";
import Tweet from "components/Tweet";

const ProfileNaviTweets = ({ usersProfile, userObj, tictoc, setTweetDetail, setToastAlert, setToastText, setUsersProfile, currentPage, setCurrentPage }) => {

    if(tictoc.length === 0){
        return null;
    }

    return(
        <>
            {
                tictoc.map((element) => {
                    return <Tweet key={element.createdAt} tictoc={element} isOwner={true} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} />
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
                                        key={element.userId} user={element} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile}
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