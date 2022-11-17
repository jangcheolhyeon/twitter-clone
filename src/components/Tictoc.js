import React, { useEffect, useState } from "react";
import { doc, deleteDoc, updateDoc, query, collection, onSnapshot } from 'firebase/firestore';
import { deleteObject, ref } from "firebase/storage";
import { storageService, db } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faRetweet, faCommentDots, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import ReplyTweet from "components/ReplyTweet";


const Tictoc = ({ tictoc, isOwner, userObj, deleteParentTweet, setRetweetContent, setRetweetState, setParentBundle, usersProfile, setToastState }) => {
    const [newText, setNewText] = useState(tictoc.text);
    const [userName, setUserName] = useState();
    const [userPhoto, setUserPhoto] = useState(); 
    const [commentList, setCommnetList] = useState([]);
    const [likeState, setLikeState] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [hover, setHover] = useState();
    const [enrollDate, setEnrollDate] = useState();

    const onDeleteTweet = async() => {
        if(tictoc.parent && tictoc.RetweetContent === ''){
            deleteParentTweet(tictoc.id);
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
    console.log('tictoc', tictoc);
    console.log('usersProfile', usersProfile);

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

            setToastState(true);
        }
        setLikeState((prev) => !prev);
    }

    
    return(
        <>
            <div className="tweet">
                <div className="tweet_user_photo_container">
                    <img src={userPhoto} className="user_photo_image" />
                </div>

                <div className="tweet_content">
                    {isOwner && <div className="close_tweet">
                        <FontAwesomeIcon icon={faXmark} />
                    </div>}

                    <div className="tweet_userInfo_container">
                        <span className="user_name">{userName}</span>
                        <span className="enroll_date">{enrollDate}</span>
                        <FontAwesomeIcon icon={faEllipsis} className='three-dots-icon' />
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
                        <div className="action_comment_container">
                            <FontAwesomeIcon icon={faCommentDots} className="icons" />
                            <span>{commentList.filter(element => element.child && element.bundle === tictoc.bundle).length}</span>
                        </div>
                        
                        <div className="action_retweet_container">
                            <FontAwesomeIcon icon={faRetweet} className="icons" />
                            <span>{commentList.filter(element => element.RetweetContent === tictoc.text && element.bundle === tictoc.bundle).length}</span>
                        </div>

                        <div className="action_like_container">
                            {likeState ? (
                                <>
                                    <FontAwesomeIcon icon={faHeart} className="icons hearted" onClick={onClickLike} />
                                    <span className="hearted">{likeCount}</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faHeart} className="icons" onClick={onClickLike} />
                                    <span>{likeCount}</span>
                                </>
                            )}
                            {/* <FontAwesomeIcon icon={faHeart} className="icons hearted" />
                            <span>0</span> */}

                        </div>

                        <div className="action_share_container">
                            <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Tictoc;