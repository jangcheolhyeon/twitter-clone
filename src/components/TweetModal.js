import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection } from "firebase/firestore";
import { db, storageService } from "fbase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const TweetModal = ({ userObj, onTweetModalToggle, retweetState, parentBundle, RetweetContent, setRetweetContent }) => {
    const [modalTweet, setModalTweet] = useState();
    const [attachment, setAttachment] = useState('');

    
    const onChangeModalTweet = (e) => {
        const {target : {value}} = e;
        setModalTweet(value);
    }

    const onClearImage = () => {
        setAttachment('');
    }

    const onFileChange = (e) => {
        const {target : { files }} = e;
        
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    

    const onTweetBtn = async(e) => {
        if(modalTweet === ""){
            return ;
        }

        e.preventDefault();

        let attachmentUrl = "";

        //파일을 업로드 하지 않았을때 
        if(attachment !== ""){
            // 저장할 경로(userObj.uid/랜덤값(v4))
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            // 위에 만든 경로로 업로드 하기
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            // storage에 있는 파일 URL을 통해 이미지를 다운로드 하고 attchmentUrl에 넣음
            attachmentUrl = await getDownloadURL(response.ref);
        }

        // firebase에 올릴 정보들(글, 사진)
        const retweetBundle = retweetState ? (
            parentBundle
        ) : (
            Date.now()
        );

        
        const tweetObj = {
            text : modalTweet,
            createdAt : Date.now(),
            userId : userObj.uid,
            userImage : userObj.photoURL,
            attachmentUrl,
            bundle:retweetBundle,
            like_users: [],
            parent : true,
            reply_cnt : 0,
            isDeleted : false,
            RetweetContent,
        }

        // db에 tictoc이라는 컬렉션에 추가 twitObj 객체 추가
        await addDoc(collection(db, 'tictoc'), tweetObj);

        onTweetModalToggle();
        setModalTweet('');
        setAttachment('');
        setRetweetContent('');
    }



    return(
        <div className="tweet_modal_background">
            <div className="tweet_modal_container">
                <div className="delete_container" onClick={onTweetModalToggle}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>

                <div className="tweet_modal_content_container">
                    <div className="user_img_container">
                        <img src={userObj.photoURL} /> 
                    </div>
                    <div className="user_tweet_container">
                        <div>
                            <input type="text" placeholder="what's happening" className="tweet_modal_tweet_text" value={modalTweet} onChange={onChangeModalTweet}/>
                        </div>

                        {attachment && (
                            <div className="factoryForm__attachment">
                                <img src={attachment} style={{ backgroundImage : attachment }} />

                                <div className="factoryForm__clear" onClick={onClearImage}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="tweet_modal_container_footer">
                    <label htmlFor="attach-file">
                        <FontAwesomeIcon icon={faImage} />
                    </label>
                    <input type="file" id="attach-file" accept="image/*" onChange={onFileChange} />

                    <button onClick={onTweetBtn}>Tweet</button>
                </div>  
            </div>
        </div>
    )
}

export default TweetModal;