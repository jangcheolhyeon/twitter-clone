import React, { useEffect, useRef, useState } from "react";
import { doc, deleteDoc, updateDoc, query, collection, onSnapshot } from 'firebase/firestore';
import { deleteObject, ref } from "firebase/storage";
import { storageService, db } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faRetweet, faCommentDots, faArrowUpFromBracket, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import ReplyMdoal from "components/ReplyModal";
import RetweetModal from "components/RetweetModal";
import { useNavigate } from "react-router-dom";
import DeleteModal from "components/DeleteModal";
import UserInfoHover from "components/UserInfoHover";
import UserImg from "./UserImg";
import DeleteTweet from "./DeleteTweet";
import TweetThreeDots from "./TweetThreeDots";
import ReplyingTweet from "./ReplyingTweet";
import RetweetTweet from "./RetweetTweet";
import TweetActions from "./TweetActions";

const Tweet = ({ tictoc, isOwner, userObj, usersProfile, setUsersProfile, setToastAlert, setToastText, setTweetDetail, currentPage, setCurrentPage, updateCountNumber }) => {
    const [userName, setUserName] = useState();
    const [userPhoto, setUserPhoto] = useState(); 
    // const [replyList, setReplyList] = useState([]);
    const [replyState, setReplyState] = useState(false);
    const [likeState, setLikeState] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [enrollDate, setEnrollDate] = useState();
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [retweetHover, setRetweetHover] = useState(false);
    const [likeHover, setLikeHover] = useState(false);
    const [shareHover, setShareHover] = useState(false);
    const [retweetModalOpen, setRetweetModalOpen] = useState(false);
    const [retweetActive, setRetweetActive] = useState(false);
    const retweetRef = useRef();
    const [shareActive, setShareActive] = useState(false);
    const shareRef = useRef();
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

        // const q = query(collection(db, "tictoc"));
        // onSnapshot(q, (snapshot) => {
        //     const comments = snapshot.docs.map((doc) => {
        //         return {
        //             id : doc.id,
        //             ...doc.data(),
        //         }
        //     })
        //     setReplyList(comments.filter(element => {return element.child === true}));
        // })

        setLikeState(likeStateInit());
        setLikeCount(tictoc.like_users.length);

        setReplyState(replyStateInit());
        
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

    const replyStateInit = () => {
        if(tictoc.reply_users.includes(userObj.uid)){
            return true;
        }

        return false;
    }

    const onClickReply = async(event) => {
        event.stopPropagation();
        if(tictoc.isDeleted) {
            return ;
        }

        if(replyState){
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                reply_users : tictoc.reply_users.filter((element) => { return element !== userObj.uid})
            })

            setReplyState((prev) => {
                return prev - 1;
            })
            
        } else {
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                reply_users : [...tictoc.reply_users, userObj.uid]
            })

            setReplyState((prev) => {
                return prev + 1;
            })
            
            setToastAlert(true);
            setToastText('Keep it up! Retweet suceess!');
        }
    }

    const likeStateInit = () => {
        if(tictoc.like_users.includes(userObj.uid)){
            return true;
        }
        
        return false;
    }

    const onClickLike = async(event) => {
        event.stopPropagation();
        if(tictoc.isDeleted) {
            return ;
        }

        if(likeState){
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                like_users : tictoc.like_users.filter((element) => element !== userObj.uid),
            })

            setLikeCount((prev) => {
                return prev - 1;
            })

        } else {
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                like_users : [...tictoc.like_users, userObj.uid],
            });

            setLikeCount((prev) => {
                return prev + 1;
            })

            setToastAlert(true);
            setToastText('Keep it up! The more Tweets you like, the better your timeline will be.');
        }
        setLikeState((prev) => !prev);
    }

    const onRetweetToggle = (event) => {
        event.stopPropagation();
        setRetweetHover(false);
        setRetweetActive((prev) => !prev);
    }

    const reTweetOutSide = (event) => {
        if(retweetActive && !event.path.includes(retweetRef.current)){
            onRetweetToggle(event);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", reTweetOutSide);
        return () => {
            document.removeEventListener("mousedown", reTweetOutSide);
        }
    }, [retweetActive])

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

    const onShareToggle = (event) => {
        event.stopPropagation();
        setShareActive((prev) => !prev);
    }

    const shareOutSide = (event) => {
        if(shareActive && !event.path.includes(shareRef.current)){
            onShareToggle(event);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", shareOutSide);
        return () => {
            document.removeEventListener("mousedown", shareOutSide);
        }
    }, [shareActive])
    
    const userInfo = usersProfile.filter(element => element.userId === userObj.uid)[0];

    let retweetParentInfo;
    if(tictoc.retweet !== undefined && tictoc.retweet === true){
        retweetParentInfo = usersProfile.filter(element => element.userId === tictoc.retweetParentInfo.userId)[0];
    }

    const onClickCopyLink = (text) => {
        console.log("click");
        navigator.clipboard.writeText(text);
    }

    return(
        <>
            {replyModalOpen && <ReplyMdoal userObj={userObj} onReplyModalToggle={onReplyModalToggle} parentTweet={tictoc} usersProfile={usersProfile} setReplyModalOpen={setReplyModalOpen} updateCountNumber={updateCountNumber} />}
            {retweetModalOpen && <RetweetModal userObj={userObj} onRetweetModalToggle={onRetweetModalToggle} retweetContent={tictoc} usersProfile={usersProfile} setRetweetModalOpen={setRetweetModalOpen} updateCountNumber={updateCountNumber} />}
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
                            <img src={tictoc.attachmentUrl} alt="writer image" />
                        </div>
                    }

                    {tictoc.retweet &&  
                        <RetweetTweet currentPage={currentPage} onTweetClick={onTweetClick} retweetParentInfo={retweetParentInfo} tictoc={tictoc} />
                    }

                    <div className="action_container">
                        <TweetActions tictoc={tictoc} onReplyModalToggle={onReplyModalToggle} />
                        {/* <div className="action_comment_container" 
                            onMouseOver={() => { setCommentHover(true) }}
                            onMouseOut={() => { setCommentHover(false) }}
                            onClick={onReplyModalToggle}
                        >
                            {commentHover ? (
                                <FontAwesomeIcon icon={faCommentDots} className="icons comment_dots_hover" />
                            ) : (
                                <FontAwesomeIcon icon={faCommentDots} className="icons" />
                            )}
                            <span>{replyList.filter(element => { return element.parentReplyInfoDetail.id === tictoc.id }).length}</span>
                            {commentHover && 
                                (
                                    <div className="action_hover"> 
                                        Reply
                                    </div>
                                )
                            }
                        </div>
                        
                        <div className="action_retweet_container" ref={retweetRef} onClick={onRetweetToggle}
                            onMouseOver={() => { setRetweetHover(true) }}
                            onMouseOut={() => { setRetweetHover(false) }}
                            
                        >
                            {retweetHover ? (
                                <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover" : "icons retweet_hover"}/>
                            ) : (
                                <>
                                {replyState ? (
                                        <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover retweet_state" : "icons retweet_state" } />
                                    ) : (
                                        <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover" : "icons" } />
                                    )}
                                </>
                            )}

                            <span className={replyState && "retweet_state_num"}>{tictoc.reply_users.length}</span>
                            
                            {retweetHover &&
                                (
                                    <div className="action_hover"> 
                                        {replyState ? "undo retweet" : "retweet"}
                                    </div>
                                )
                            }

                            {retweetActive && (
                                <div className="tictoc_active_box">
                                    <ul>
                                        {replyState ? (
                                            <li onMouseDown={onClickReply}
                                            >Undo Retweet</li>
                                        ) : (
                                            <li onMouseDown={onClickReply}
                                            >Retweet</li>
                                        )}
                                        <li onClick={onRetweetModalToggle}>Quote Tweet</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="action_like_container"
                            onMouseOver={() => { setLikeHover(true) }}
                            onMouseOut={() => { setLikeHover(false) }}
                        >
                            {likeState ? (
                                <>
                                    {likeHover ? (
                                        <FontAwesomeIcon icon={faHeart} className="icons hearted heart_hover" onClick={onClickLike} />
                                    ) : (
                                        <FontAwesomeIcon icon={faHeart} className="icons hearted" onClick={onClickLike} />
                                    )}
                                    <span className="hearted">{likeCount}</span>
                                    {likeHover && (
                                        <div className="action_hover">
                                            UnLike
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {likeHover ? (
                                        <FontAwesomeIcon icon={faHeart} className="icons heart_hover" onClick={onClickLike} />
                                    ) : (
                                        <FontAwesomeIcon icon={faHeart} className="icons" onClick={onClickLike} />
                                    )}
                                    <span>{likeCount}</span>
                                    {likeHover && (
                                        <div className="action_hover">
                                            Like
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="action_share_container"
                            onMouseOver={() => { setShareHover(true) }}
                            onMouseOut={() => { setShareHover(false) }}
                        >
                            {shareHover ? (
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon share_hover" ref={shareRef} onClick={onShareToggle}/>
                            ) : (
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon" ref={shareRef} onClick={onShareToggle}/>
                            )}

                            {shareHover && (
                                <div className="action_hover">
                                    share
                                </div>
                            )}

                            {shareActive && (
                                <div className="tictoc_active_box">
                                    <ul>
                                        <li onMouseDown={() => onClickCopyLink('www.abc.com')}>Copy link to Tweet</li>
                                        <li>share Tweet</li>
                                        <li>BookMark</li>
                                    </ul>
                                </div>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Tweet;