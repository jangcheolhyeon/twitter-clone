import React, { useEffect, useRef, useState } from "react";
import { doc, deleteDoc, updateDoc, query, collection, onSnapshot } from 'firebase/firestore';
import { deleteObject, ref } from "firebase/storage";
import { storageService, db } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faRetweet, faCommentDots, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import ReplyMdoal from "components/ReplyModal";


const Tictoc = ({ tictoc, isOwner, userObj, usersProfile, setToastAlert, setToastText }) => {
    const [newText, setNewText] = useState(tictoc.text);
    const [userName, setUserName] = useState();
    const [userPhoto, setUserPhoto] = useState(); 
    const [commentList, setCommnetList] = useState([]);
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

    const onDeleteTweet = async() => {
        if(tictoc.parent && tictoc.RetweetContent === ''){
            await deleteDoc(doc(db, "tictoc", `${tictoc.id}`));
            await deleteObject(ref(storageService, `${tictoc.attachmentUrl}`));
        } else{
            await deleteDoc(doc(db, "tictoc", `${tictoc.id}`));
            await deleteObject(ref(storageService, `${tictoc.attachmentUrl}`));
        }
    }

    const onChangeNewText = (e) => {
        setNewText(e.target.value);
    }

    const onUpdateTweetText = async(event) => {
        event.preventDefault();

        await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
            text : newText
        } );
    }

    const onModifyTweet = () => {

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
            setCommnetList(comments);
        })

        setLikeState(likeStateInit());
        setLikeCount(tictoc.like_users.length);
        

        const time = new Date(tictoc.createdAt);
        setEnrollDate((time.getMonth()+1) + "." + (time.getDate()));
    }, []);

    const likeStateInit = () => {
        if(tictoc.like_users.includes(tictoc.userId)){
            return true;
        }
        return false;
    }

    const onClickLike = async() => {
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

    const onThreedotsToggle = () => {
        setThreedotsActive((prev) => !prev);
    }

    const threedotsOutSide = (event) => {
        if(threedotsActive && !event.path.includes(dotsRef.current)){
            setThreedotsActive();
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", threedotsOutSide);
        return () => {
            document.removeEventListener("mousedown", threedotsOutSide);
        }
    }, [threedotsActive])

    const onReplyModalToggle = () => {
        console.log("tictoc = " ,tictoc);
        setReplyModalOpen((prev) => !prev);
    }

    return(
        <>
            {replyModalOpen && <ReplyMdoal userObj={userObj} onReplyModalToggle={onReplyModalToggle} parentTweet={tictoc} usersProfile={usersProfile} />}
            <div className="tweet">
                <div className="tweet_user_photo_container">
                    <img src={userPhoto} className="user_photo_image" />
                </div>

                <div className="tweet_content">
                    {isOwner && <div className="close_tweet" onClick={onDeleteTweet} 
                        onMouseOver={() => { setXMarkHover(true) }}
                        onMouseOut={() => { setXMarkHover(false) }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                        {xMarkHover && 
                            (
                                <div className="action_hover"> 
                                    remove
                                </div>
                            )
                        }
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
                                        <div className="tictoc_active_box threedots_active_container">
                                            <ul>
                                                {isOwner ? 
                                                    (
                                                        <li>Modify</li>
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
                        <span>{tictoc.text}</span>
                    </div>

                    {tictoc.attachmentUrl && 
                        <div className="user_tweet_image_container">
                            <img src={tictoc.attachmentUrl} />
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
                            <span>{commentList.filter(element => element.child && element.bundle === tictoc.bundle).length}</span>
                            {commentHover && 
                                (
                                    <div className="action_hover"> 
                                        Reply
                                    </div>
                                )
                            }
                        </div>
                        
                        <div className="action_retweet_container"
                            onMouseOver={() => { setRetweetHover(true) }}
                            onMouseOut={() => { setRetweetHover(false) }}
                        >
                            {retweetHover ? (
                                <FontAwesomeIcon icon={faRetweet} className="icons retweet_hover" />
                            ) : (
                                <FontAwesomeIcon icon={faRetweet} className="icons" />
                            )}
                            <span>{commentList.filter(element => element.RetweetContent === tictoc.text && element.bundle === tictoc.bundle).length}</span>
                            {retweetHover &&
                                (
                                    <div className="action_hover"> 
                                        Retweet
                                    </div>
                                )
                            }
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
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon share_hover" />
                            ) : (
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon" />
                            )}

                            {shareHover && (
                                <div className="action_hover">
                                    share
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Tictoc;