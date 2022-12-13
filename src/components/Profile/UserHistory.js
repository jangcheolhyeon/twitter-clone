import React, { useState } from "react";
import ProfileNaviLikes from "./ProfileNaviLikes";
import ProfileNaviMedia from "./ProfileNaviMedia";
import ProfileNaviTweets from "./ProfileNaviTweets";
import ProfileNaviTweets_Replies from "./ProfileNaviTweets_Replies";

const UserHistory = ({ usersProfile, userObj, myTweetList, setToastAlert, setToastText, setUsersProfile, currentPage, setCurrentPage, setTweetDetail, tweets }) => {
    const [currentNavi, setCurrentNavi] = useState({
        Tweets : true,
        TweetsReplies : false,
        Media : false,
        Likes : false
    });


    const handleTraceClick = (key) => {        
        let newCurrentNavi = {
            Tweets : false,
            TweetsReplies : false,
            Media : false,
            Likes : false
        };

        switch(key){
            case 'Tweets' :
                newCurrentNavi.Tweets = true
                break;
            case 'TweetsReplies' :
                newCurrentNavi.TweetsReplies = true
                break;
            case 'Media' :
                newCurrentNavi.Media = true
                break;
            case 'Likes' :
                newCurrentNavi.Likes = true
                break;
        }
        setCurrentNavi(newCurrentNavi);
    }

    return(
        <>
            <div className='my_trace_navi'>    
                <div className={currentNavi.Tweets ? "my_trace_box tweets tweets_active" : "my_trace_box tweets"} onClick={() => handleTraceClick('Tweets')}>
                    <span>Tweets</span>
                </div>
                <div className={currentNavi.TweetsReplies ? 'my_trace_box tweets_replies tweets_replies_active' : 'my_trace_box tweets_replies'} onClick={() => handleTraceClick('TweetsReplies')}>
                    <span>Tweets & replies</span>
                </div>
                <div className={currentNavi.Media ? 'my_trace_box media media_active' : 'my_trace_box media'} onClick={() => handleTraceClick('Media')}>
                    <span>Media</span>
                </div>
                <div className={currentNavi.Likes ? 'my_trace_box likes likes_active' : 'my_trace_box likes'} onClick={() => handleTraceClick('Likes')}>
                    <span>Likes</span>
                </div>
            </div>
            

            {currentNavi.Tweets && <ProfileNaviTweets usersProfile={usersProfile} userObj={userObj} tictoc={myTweetList} setToastAlert={setToastAlert} setToastText={setToastText} setUsersProfile={setUsersProfile} currentPage={currentPage} setCurrentPage={setCurrentPage} setTweetDetail={setTweetDetail} />}
            {currentNavi.TweetsReplies && <ProfileNaviTweets_Replies usersProfile={usersProfile} userObj={userObj} setUsersProfile={setUsersProfile} />}
            {currentNavi.Media && <ProfileNaviMedia usersProfile={usersProfile} userObj={userObj} />}
            {currentNavi.Likes && <ProfileNaviLikes userObj={userObj} tweets={tweets} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} />}
        </>
    );
}

export default UserHistory;