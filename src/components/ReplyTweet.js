import React, { useEffect, useState } from "react";
import { collection, addDoc, updateDoc, doc, query, getDocs, onSnapshot } from "firebase/firestore"; 
import { db, storageService } from 'fbase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { FacebookIcon, TwitterIcon, FacebookShareButton, TwitterShareButton } from 'react-share';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet, faCommentDots, faArrowUpFromBracket, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";


const ReplyTweet = ({ parentTweet, userObj, setRetweetContent, setRetweetState, setParentBundle }) => {
    const [editing, setEditing] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [attachment, setAttachment] = useState('');
    const [likeState, setLikeState] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentList, setCommnetList] = useState([]);
    const [isShareClicked, setIsShareClicked] = useState(false);
    const [enrollDate, setEnrollDate] = useState();
    const [enrollTime, setEnrollTime] = useState();

    useEffect(() => {
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

        const time = new Date(parentTweet.createdAt);
        setEnrollDate((time.getMonth()+1) + "." + (time.getDate()));

        const hours = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
        const seconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : `${time.getSeconds()}`;
        setEnrollTime(hours + ":" + seconds);
    }, []);


    const onRetweetBtn = () => {
        // 삭제된 경우에는 return 으로 기능 막음
        if(parentTweet.isDeleted){
            return ;
        }
        setRetweetContent(parentTweet.text);
        setRetweetState(true);
        setParentBundle(parentTweet.bundle);
    }

    // 좋아요 누른 사람 명단에 포함되어 있으면 true 아니면 false
    const likeStateInit = () => {
        if(parentTweet.like_users.includes(parentTweet.userId)){
            return true;
        }
        return false;
    }

    // 처음 실행하면 likeCount(like갯수가 몇개인지)와 likestate(내가 like상태인지)를 초기화
    useEffect(() => {
        setLikeCount(parentTweet.like_users.length);
        setLikeState(likeStateInit());
    }, [])

    // 수정상태인지 아니지
    const onToggleReplyState = () => {
        // 삭제된 경우에는 return 으로 기능 막음
        if(parentTweet.isDeleted){
            return ;
        }
        setEditing((prev) => !prev);
    }

    //답글 텍스트 이벤트
    const onChangeReplyText = (e) => {
        const {target : { value }} = e;
        setReplyText(value);
    }

    // 댓글 작성 로직
    const onWriteReply = async() => {
        setEditing(prev => !prev);

        let attachmentUrl = ""

        if(attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            attachmentUrl = await getDownloadURL(response.ref);
        }

        const replyTweetObj = {
            text : replyText,
            createdAt : Date.now(),
            // createdAt : new Date(),
            userId : userObj.uid,
            bundle : Number(`${parentTweet.bundle}`),
            attachmentUrl,
            userImage : userObj.photoURL,
            like_users : [],
            retweetContent : '',
            child : true,
        }

        await addDoc(collection(db, 'tictoc'), replyTweetObj);
        setReplyText('');
    }


    // 댓글로 파일 첨부
    const onUploadReplyImg = (e) => {
        const {target : { files }} = e;
        
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }


    // 댓글에서 이미지 삭제 버튼
    const onClearImage = () => {
        setAttachment('');
    }


    // like버튼을 눌렀을때 likeState의 값으로 like_users의 값을 빼고 넣기
    const onClickLike = async() => {
        // 삭제된 경우에는 return 으로 기능 막음
        if(parentTweet.isDeleted) {
            return ;
        }


        if(likeState){
            // 라이크 o -> 라이크 x

            await updateDoc(doc(db, "tictoc", `${parentTweet.id}`), {
                like_users : parentTweet.like_users.filter((element) => element !== userObj.uid),
            })

            setLikeCount((prev) => {
                return prev - 1;
            })

        } else {
            // 라이크 x -> 라이크 o            
            await updateDoc(doc(db, "tictoc", `${parentTweet.id}`), {
                like_users : [...parentTweet.like_users, userObj.uid],
            });

            setLikeCount((prev) => {
                return prev + 1;
            })

        }
        setLikeState((prev) => !prev);
    }
    
    const onClickCancel = () => {
        setEditing((prev) => !prev);
    }

    const handleShareStateChange = () => {
        setIsShareClicked((prev) => !prev);
    }



    return(
        <>
            {editing ? (
                <div className="reply_container">
                    <input type="text" value={replyText} onChange={onChangeReplyText} className="reply_text" />
                    <input type="file" accept='image/*' onChange={onUploadReplyImg}/>
                    {attachment && (
                        <div className="factoryForm__attachment">
                            <img src={attachment} style={{ backgroundImage : attachment}} />

                            <div className="factoryForm__clear" onClick={onClearImage}>
                                <span>Remove</span>
                            </div>
                        </div>
                    )}
                    <button onClick={onWriteReply}>submit</button>
                    <button onClick={onClickCancel}>cancel</button>
                </div>
            ) : (
                <>
                    <div className="write_date">
                        <span className="enroll_time">{enrollTime}</span>
                        <span>{enrollDate}</span>
                    </div>
                    <div className="action_container">
                        {parentTweet.parent && <div className="action_comment_container">
                            <FontAwesomeIcon icon={faCommentDots} className="icons" onClick={onToggleReplyState} />
                            <span>{commentList.filter((element) => element.child && element.bundle === parentTweet.bundle).length}</span>
                        </div>}
                        <div className="action_retweet_container">
                            <FontAwesomeIcon icon={faRetweet} className="icons" onClick={onRetweetBtn} />
                            <span>{commentList.filter(element => element.RetweetContent === parentTweet.text && element.bundle === parentTweet.bundle).length}</span>
                        </div>
                        <div className="action_like_container">
                            {likeState ? (
                                <>
                                    <FontAwesomeIcon icon={faHeart} className="icons hearted" onClick={onClickLike} />
                                    <span>{likeCount}</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faHeart} className="icons" onClick={onClickLike} />
                                    <span>{likeCount}</span>
                                </>
                            )}
                            
                        </div>
                        <div className="action_share_container">
                        {isShareClicked && 
                            <div className="share_icon_container">
                                <ul className="share_items">
                                    <li>
                                    <FacebookShareButton url="https://www.facebook.com">
                                        <FacebookIcon size={22} round={true} borderRadius={20}></FacebookIcon>
                                    </FacebookShareButton>
                                    </li>
                                    <li>
                                    <TwitterShareButton url="https://twitter.com"> 
                                        <TwitterIcon size={22} round={true} borderRadius={20}></TwitterIcon>
                                    </TwitterShareButton>
                                    </li>
                                </ul>
                            </div>}
                            <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon" onClick={handleShareStateChange} />
                        </div>
                    </div>
                </>
            )
        
        }
        </>
        
    );
}

export default ReplyTweet;