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

const Tweet = ({ tictoc, isOwner, userObj, usersProfile, setToastAlert, setToastText, setTweetDetail }) => {
    const [newText, setNewText] = useState(tictoc.text);
    const [userName, setUserName] = useState();
    const [userPhoto, setUserPhoto] = useState(); 
    const [replyList, setReplyList] = useState([]);
    const [replyState, setReplyState] = useState(false);
    const [retweetList, setRetweetList] = useState([]);
    const [likeState, setLikeState] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [enrollDate, setEnrollDate] = useState();
    const [xMarkHover, setXMarkHover] = useState(false);
    const [threedotsHover, setThreedotsHover] = useState(false);
    const [commentHover, setCommentHover] = useState(false);
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [retweetHover, setRetweetHover] = useState(false);
    const [likeHover, setLikeHover] = useState(false);
    const [shareHover, setShareHover] = useState(false);
    const [threedotsActive, setThreedotsActive] = useState(false);
    const dotsRef = useRef();
    const [retweetModalOpen, setRetweetModalOpen] = useState(false);
    const [retweetActive, setRetweetActive] = useState(false);
    const retweetRef = useRef();
    const [shareActive, setShareActive] = useState(false);
    const shareRef = useRef();

    const onDeleteTweet = async(event) => {
        event.stopPropagation();
        setToastAlert(true);
        setToastText('Your Tweet was Deleted');

        await deleteDoc(doc(db, "tictoc", `${tictoc.id}`));
        if(tictoc.attachmentUrl !== null || tictoc.attachmentUrl !== ""){
            await deleteObject(ref(storageService, `${tictoc.attachmentUrl}`));
        }
    }

    const parentInfo = usersProfile.filter(element => {
        return element.userId === tictoc.userId;
    })[0];

    const onChangeNewText = (e) => {
        setNewText(e.target.value);
    }

    const onUpdateTweetText = async(event) => {
        event.preventDefault();

        await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
            text : newText
        } );
    }
        
    useEffect(() => {
        usersProfile.map(element => {
            if(element.userId === tictoc.userId){
                setUserName(element.displayName);
                setUserPhoto(element.userImage);
            } 
        });

        const q = query(collection(db, "tictoc"));
        onSnapshot(q, (snapshot) => {
            const comments = snapshot.docs.map((doc) => {
                return {
                    id : doc.id,
                    ...doc.data(),
                }
            })
            setReplyList(comments.filter(element => {return element.child === true}));
            setRetweetList(comments.filter(element => {return element.retweet === true}))
        })

        setLikeState(likeStateInit());
        setLikeCount(tictoc.like_users.length);

        setReplyState(replyStateInit());
        
        const time = new Date(tictoc.createdAt);
        setEnrollDate((time.getMonth()+1) + "." + (time.getDate()));
    }, []);

    const replyStateInit = () => {
        if(tictoc.reply_users.includes(tictoc.userId)){
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
        if(tictoc.like_users.includes(tictoc.userId)){
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


    const onThreedotsToggle = (event) => {
        event.stopPropagation();
        setThreedotsActive((prev) => !prev);
    }

    const threedotsOutSide = (event) => {
        if(threedotsActive && !event.path.includes(dotsRef.current)){
            onThreedotsToggle(event);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", threedotsOutSide);
        return () => {
            document.removeEventListener("mousedown", threedotsOutSide);
        }
    }, [threedotsActive])

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
        setTweetDetail(tictoc);
        navi('/details');
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

    const handlePinActive = async() => {
        if(userInfo.pin === tictoc.id){
            await updateDoc(doc(db, "usersInfo", `${userInfo.id}`), {
                pin : ""
            });
        }
        else{
            await updateDoc(doc(db, "usersInfo", `${userInfo.id}`), {
                pin : tictoc.id
            });
        }
    }
    
    return(
        <>
            {replyModalOpen && <ReplyMdoal userObj={userObj} onReplyModalToggle={onReplyModalToggle} parentTweet={tictoc} usersProfile={usersProfile} setReplyModalOpen={setReplyModalOpen}/>}
            {retweetModalOpen && <RetweetModal userObj={userObj} onRetweetModalToggle={onRetweetModalToggle} retweetContent={tictoc} usersProfile={usersProfile} setRetweetModalOpen={setRetweetModalOpen} />}
            <div className="tweet" onClick={onTweetClick}>
                <div className="tweet_user_photo_container">
                    <img src={userPhoto} className="user_photo_image" />
                </div>

                <div className="tweet_content">
                    {isOwner && <div className="close_tweet">
                        <FontAwesomeIcon icon={faXmark} 
                        onMouseOver={() => { setXMarkHover(true) }}
                        onMouseOut={() => { setXMarkHover(false) }}
                        onClick={onDeleteTweet}
                        className="x_mark_icon"
                        />
                        {xMarkHover && 
                            (
                                <div className="action_hover"> 
                                    remove
                                </div>
                            )
                        }

                        {Boolean(userInfo.pin.length) && userInfo.pin === tictoc.id && <>
                            <div className="tweet_pin">
                                <FontAwesomeIcon icon={faThumbtack} />
                                <span>Pinned Tweet</span>
                            </div>
                        </>}
                    </div>}


                    <div className="tweet_userInfo_container">
                        <div className="tweet_more_container">
                            <FontAwesomeIcon icon={faEllipsis} className='three-dots-icon'
                                onMouseOver={() => { setThreedotsHover(true) }}
                                onMouseOut={() => { setThreedotsHover(false) }}
                                onClick={onThreedotsToggle}
                                ref={dotsRef}
                                />
                                {threedotsHover && 
                                    (
                                        <div className="action_hover">
                                            more
                                        </div>
                                    )
                                }

                                {threedotsActive && 
                                    (
                                        <div className="tictoc_active_box threedots_active_container" >
                                            <ul>
                                                {isOwner ? 
                                                    (
                                                        <>
                                                            <li onMouseDown={handlePinActive}>Pin to your profile</li>
                                                            <li>change who can reply</li>
                                                        </>
                                                    )
                                                    :
                                                    (<>
                                                        <li>Follow</li>
                                                        <li>Block</li>
                                                        <li>Mute</li>
                                                    </>)
                                                }
                                            </ul>
                                        </div>
                                    )
                                }
                        </div>

                        <span className="user_name">{userName}</span>
                        <span className="enroll_date">{enrollDate}</span>
                    </div>

                    <div className="user_tweet_content">
                        {tictoc.parent && <span>{tictoc.text}</span>}
                        {tictoc.child && 
                            <div className="reply_content">
                                <span className="replying">Replying to <span className="user_email">@{parentInfo.email.split('@')[0]}</span></span>
                                <span className="text">{tictoc.text}</span>
                            </div>
                        }
                    </div>

                    {tictoc.attachmentUrl && 
                        <div className="user_tweet_image_container">
                            <img src={tictoc.attachmentUrl} />
                        </div>
                    }

                    {tictoc.retweet && 
                        <div className="tictoc_retweet_content_container">
                            <div className="retweet_content_container">
                                <div className="retweet_top">
                                    <img src={parentInfo.userImage} />
                                    <span>{parentInfo.displayName}</span>
                                    <span className="user_email">@{parentInfo.email.split('@')[0]}</span>
                                </div>
                                <div className="retweet_content">
                                    <span>{tictoc.retweetText}</span>
                                </div>

                                {tictoc.retweetAttachment && (
                                    <div className="retweet_img">
                                        <img src={tictoc.retweetAttachment} style={{ backgroundImage : tictoc.retweetAttachment }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    <div className="action_container">
                        <div className="action_comment_container" 
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

                            <span className={replyState && "retweet_state_num"}>{retweetList.filter(element => { return element.retweetParent === tictoc.id }).length + Number(replyState)}</span>
                            
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
                                        <li>Copy link to Tweet</li>
                                        <li>share Tweet</li>
                                        <li>BookMark</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Tweet;