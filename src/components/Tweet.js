import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import ReplyMdoal from "components/TweetAction/ReplyingModal";
import RetweetModal from "components/TweetAction/RetweetModal";
import { useNavigate } from "react-router-dom";
import UserImg from "components/TweetAction/UserImg";
import DeleteTweet from "components/TweetAction/DeleteTweet";
import TweetThreeDots from "components/TweetAction/TweetThreeDots";
import ReplyingTweet from "components/TweetAction/ReplyingTweet";
import RetweetTweet from "components/TweetAction/RetweetTweet";
import TweetActions from "components/Profile/TweetActions";

const Tweet = ({ tictoc, isOwner, userObj, usersProfile, setUsersProfile, setToastAlert, setToastText, setTweetDetail, currentPage, setCurrentPage }) => {
    const [userName, setUserName] = useState();
    const [userPhoto, setUserPhoto] = useState(); 
    const [enrollDate, setEnrollDate] = useState();
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [retweetHover, setRetweetHover] = useState(false);
    const [retweetModalOpen, setRetweetModalOpen] = useState(false);
    const [retweetActive, setRetweetActive] = useState(false);
    const [emailHover, setEmailHover] = useState(false);
    const [userImgHover, setUserImgHover] = useState(false);
        
    useEffect(() => {
        window.scrollTo({top:0, behavior:'smooth'});
        usersProfile.map(element => {
            if(element.userId === tictoc.userId){
                setUserName(element.displayName);
                setUserPhoto(element.userImage);
            } 
        });
        
        const time = new Date(tictoc.createdAt);
        setEnrollDate((time.getMonth()+1) + "." + (time.getDate()));
    }, []);

    useEffect(() => {
        usersProfile.map(element => {
            if(element.userId === tictoc.userId){
                setUserName(element.displayName);
                setUserPhoto(element.userImage);
            } 
        });
    }, [usersProfile])

    const onReplyModalToggle = (event) => {
        event.stopPropagation();
        setReplyModalOpen((prev) => !prev);
    }

    const onRetweetModalToggle = (event) => {
        event.stopPropagation();
        setRetweetModalOpen((prev) => !prev);
        setRetweetActive(false);
        setRetweetHover(false);
    }
    
    const navi = useNavigate();

    const onTweetClick = () => {
        if(currentPage === "home"){
            setTweetDetail(tictoc);
            setCurrentPage("details");
            navi('/details');
        } else if(currentPage === "details"){
            setTweetDetail(tictoc.retweetParentInfo);
            setCurrentPage("detailsParent");
            navi('/detailsParent')
        } else if(currentPage === "profile"){
            setTweetDetail(tictoc.retweetParentInfo);
            setCurrentPage("details");
            navi('/details');
        }
    }
    
    const userInfo = usersProfile.filter(element => element.userId === userObj.uid)[0];

    return(
        <>
            {replyModalOpen && <ReplyMdoal userObj={userObj} onReplyModalToggle={onReplyModalToggle} parentTweet={tictoc} usersProfile={usersProfile} setReplyModalOpen={setReplyModalOpen} />}
            {retweetModalOpen && <RetweetModal userObj={userObj} onRetweetModalToggle={onRetweetModalToggle} retweetContent={tictoc} usersProfile={usersProfile} setRetweetModalOpen={setRetweetModalOpen} />}
            <div className={currentPage === 'home' && emailHover === false && userImgHover === false ? 'tweet tweet_home' : 'tweet'} onClick={currentPage === "home" || currentPage === "profile" ? onTweetClick : undefined}>

                <UserImg tictoc={tictoc} userImgHover={userImgHover} userPhoto={userPhoto} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} setUserInfoHover={setUserImgHover} />

                <div className="tweet_content">
                    {isOwner && <div className="close_tweet">
                        <DeleteTweet tictoc={tictoc} setToastAlert={setToastAlert} setToastText={setToastText} setCurrentPage={setCurrentPage} />

                        {Boolean(userInfo.pin.length) && userInfo.pin === tictoc.id && <>
                            <div className="tweet_pin">
                                <FontAwesomeIcon icon={faThumbtack} />
                                <span>Pinned Tweet</span>
                            </div>
                        </>}
                    </div>}


                    <div className={isOwner ? 'tweet_userInfo_container' : 'tweet_userInfo_container isNotOwner'}>
                        <div className="tweet_more_container">
                            <TweetThreeDots isOwner={isOwner} userInfo={userInfo} tictoc={tictoc} />
                        </div>

                        <span className="user_name">{userName}</span>
                        <span className="enroll_date">{enrollDate}</span>
                    </div>

                    <div className="user_tweet_content">
                        <ReplyingTweet tictoc={tictoc} emailHover={emailHover} setEmailHover={setEmailHover} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} />
                    </div>

                    {tictoc.attachmentUrl && 
                        <div className="user_tweet_image_container">
                            <img src={tictoc.attachmentUrl} alt="writer img" />
                        </div>
                    }

                    {tictoc.retweet &&  
                        <RetweetTweet currentPage={currentPage} onTweetClick={onTweetClick} tictoc={tictoc} usersProfile={usersProfile} />
                    }

                    <div className="action_container">

                        <TweetActions 
                            tictoc={tictoc} 
                            userObj={userObj} 
                            onReplyModalToggle={onReplyModalToggle} 
                            retweetHover={retweetHover} 
                            setRetweetHover={setRetweetHover} 
                            retweetActive={retweetActive} 
                            setRetweetActive={setRetweetActive} 
                            setToastAlert={setToastAlert}
                            setToastText={setToastText}
                            onRetweetModalToggle={onRetweetModalToggle}
                        />

                    </div>
                </div>
            </div>
        </>
    );
}

export default Tweet;