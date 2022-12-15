import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEllipsis, faUserPlus, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import RecommendFriend from "components/Navigation/RecommendFriend";
import Tweet from "components/Tweet";

const ShowMyTweetsNReplies = ({ userObj, usersProfile, setUsersProfile, myTweetList, setToastAlert, setToastText, currentPage, setCurrentPage, setTweetDetail }) => {
    console.log("myTweetList", myTweetList);
    return(
        <>
            {myTweetList.length === 0 || myTweetList === null ? (
                <div className="profile_empty_my_tweet_container">
                    <h1>No Tweet, Reply, Retweet</h1>
                </div>
            ) : (
                <>
                    {myTweetList.map(element => {
                        return <Tweet key={element.createdAt} tictoc={element} isOwner={true} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                    })}
                </>
            )}

            <>
                <div className='my_trace_content'>
                    <div className='my_trace_content_top'>
                        <span>Let's get you set up</span>
                        <FontAwesomeIcon icon={faEllipsis} className='three-dots-icon' />
                    </div>
                    <div className='setup_container'>
                        <div className="setup_box">
                            <div>
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <span>Complete your profile</span>
                        </div>
                        <div className="setup_box">
                            <div>
                                <FontAwesomeIcon icon={faUserPlus} />
                            </div>
                            <span>Follow 5 accounts</span>
                        </div>
                        <div className="setup_box">
                            <div>
                                <FontAwesomeIcon icon={faCommentDots} />
                            </div>
                            <span>Follow 3 topics</span>
                        </div>
                    </div>
                </div>

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
        </>
    )
}

export default ShowMyTweetsNReplies;