import React, { useEffect, useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore"; 
import { db, storageService } from 'fbase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { FacebookIcon, TwitterIcon, FacebookShareButton, TwitterShareButton } from 'react-share';


const ReplyTwit = ({ parentTwit, userObj, setRetwitContent }) => {
    const [isReply, setIsReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [attachment, setAttachment] = useState('');
    const [likeState, setLikeState] = useState(false);
    const [likeCount, setLikeCount] = useState(0);


    // 
    const onRetwitBtn = () => {
        // 삭제된 경우에는 return 으로 기능 막음
        if(parentTwit.isDeleted){
            return ;
        }
        setRetwitContent(parentTwit.text);
        // console.log(parentTwit.text);
    }

    // 좋아요 누른 사람 명단에 포함되어 있으면 true 아니면 false
    const likeStateInit = () => {
        if(parentTwit.like_users.includes(parentTwit.userId)){
            return true;
        }
        return false;
    }

    // 처음 실행하면 likeCount(like갯수가 몇개인지)와 likestate(내가 like상태인지)를 초기화
    useEffect(() => {
        setLikeCount(parentTwit.like_users.length);
        setLikeState(likeStateInit());
    }, [])

    // 수정상태인지 아니지
    const onReplyWrite = () => {
        // 삭제된 경우에는 return 으로 기능 막음
        if(parentTwit.isDeleted){
            return ;
        }
        setIsReply((prev) => !prev);
    }

    //답글 텍스트 이벤트
    const onChangeReplyText = (e) => {
        const {target : { value }} = e;
        setReplyText(value);
    }

    // 댓글 작성 로직
    const onWriteReply = async() => {
        setIsReply(prev => !prev);

        let attachmentUrl = ""

        if(attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            attachmentUrl = await getDownloadURL(response.ref);
        }

        const replyTwitObj = {
            text : replyText,
            createdAt : Number(Date.now()),
            userId : userObj.uid,
            bundle : Number(`${parentTwit.bundle}`),
            attachmentUrl,
            userImage : userObj.photoURL,
            like_users : [],
            retwitContent : '',
            child : true,
        }

        await addDoc(collection(db, 'tictoc'), replyTwitObj);
        setReplyText('');

    }


    // 댓글로 파일 첨부
    const onUpdateReply = (e) => {
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
    const onLikeBtn = async() => {
        // 삭제된 경우에는 return 으로 기능 막음
        if(parentTwit.isDeleted) {
            return ;
        }

        if(likeState){
            // 라이크 o -> 라이크 x

            await updateDoc(doc(db, "tictoc", `${parentTwit.id}`), {
                like_users : parentTwit.like_users.filter((element) => element !== parentTwit.userId),
            })

            setLikeCount((prev) => {
                return prev - 1;
            })

        } else {
            // 라이크 x -> 라이크 o            
            await updateDoc(doc(db, "tictoc", `${parentTwit.id}`), {
                like_users : [...parentTwit.like_users, parentTwit.userId],
            });

            setLikeCount((prev) => {
                return prev + 1;
            })

        }
        setLikeState((prev) => !prev);
    }
    
    const onCancelBtn = () => {
        setIsReply((prev) => !prev);
    }

    return(
        <>
            {isReply ? (
                <div className="reply_container">
                    <input type="text" value={replyText} onChange={onChangeReplyText} style={{border:'1px solid black'}} />
                    <input type="file" accept='image/*' onChange={onUpdateReply}/>
                    {attachment && (
                        <div className="factoryForm__attachment">
                            <img src={attachment} style={{ backgroundImage : attachment, top:"49px", right:"40px" }} />

                            <div className="factoryForm__clear" onClick={onClearImage} style={{margin:"10px"}}>
                                <span>Remove</span>
                            </div>
                        </div>
                    )}
                    <button onClick={onWriteReply}>submit</button>
                    <button onClick={onCancelBtn}>cancel</button>
                </div>
            ) : (
                <div className="reply_btns_container">
                    <button onClick={onReplyWrite} style={{ marginTop: "20px" }}>reply</button>
                    <button onClick={onRetwitBtn}>retwit</button>
                    <button onClick={onLikeBtn} >Like</button>
                    <h1 className="like_count_number">{likeCount}</h1>
                    <div className="link_container">
                        <span>공유하기</span>
                        <FacebookShareButton url="https://www.facebook.com">
                            <FacebookIcon size={40} round={true} borderRadius={20}></FacebookIcon>
                        </FacebookShareButton>

                        <TwitterShareButton url="https://twitter.com"> 
                            <TwitterIcon size={40} round={true} borderRadius={20}></TwitterIcon>
                        </TwitterShareButton>
                        <button>3</button>
                        <button>4</button>
                    </div>
                </div>
            )
        
        }
        </>
        
    );
}

export default ReplyTwit;