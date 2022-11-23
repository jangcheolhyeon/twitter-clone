import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTimes, faImage } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storageService } from "fbase";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";

const RetweetModal = ({ userObj, onRetweetModalToggle, retweetContent, usersProfile }) => {
    const [modalRetweet, setModalRetweet] = useState();
    const [attachment, setAttachment] = useState('');

    const onChangeModalRetweet = (event) => {
        setModalRetweet(event.target.value);
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

    const onRetweetBtn = async(e) => {
        if(modalRetweet === ""){
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
        
        const tweetObj = {
            text : modalRetweet,
            createdAt : Date.now(),
            userId : userObj.uid,
            userImage : userObj.photoURL,
            attachmentUrl,
            parent : true,
            reply_cnt : 0,
            isDeleted : false,
            retweet:true,
            retweetParent: retweetContent.id
        }

        await addDoc(collection(db, 'tictoc'), tweetObj);

        onRetweetModalToggle();
        setModalRetweet('');
        setAttachment('');
    }    

    console.log('userObj', userObj);
    console.log('retweetContent', retweetContent);
    console.log('usersProfile', usersProfile);

    const parentInfo = usersProfile.filter(element => {
        return element.userId === retweetContent.userId;
    })[0];

    console.log("parentInfo", parentInfo);

    return(
        <>
            <div className="tweet_modal_background">
                <div className="tweet_modal_container">
                    <div className="delete_container" onClick={onRetweetModalToggle}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>

                    <div className="tweet_modal_content_container">
                        <div className="user_img_container">
                            <img src={userObj.photoURL} /> 
                        </div>
                        <div className="user_tweet_container">
                            <div>
                                <input type="text" placeholder="Add a comment" className="tweet_modal_tweet_text" value={modalRetweet} onChange={onChangeModalRetweet}/>
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

                    <div className="retweet_content_container">
                        <div className="retweet_top">
                            <img src={parentInfo.userImage} />
                            <span>{parentInfo.displayName}</span>
                            <span className="user_email">@{parentInfo.email.split('@')[0]}</span>
                        </div>
                        <div className="retweet_content">
                            <span>{retweetContent.text}</span>
                        </div>

                        {retweetContent.attachmentUrl && (
                            <div className="retweet_img">
                                <img src={retweetContent.attachmentUrl} style={{ backgroundImage : retweetContent.attachmentUrl }} />
                            </div>
                        )}
                    </div>
                    

                    <div className="tweet_modal_container_footer">
                        <label htmlFor="retweet_modal2">
                            <FontAwesomeIcon icon={faImage} />
                        </label>
                        <input type="file" id="retweet_modal2" accept="image/*" onChange={onFileChange} />

                        <button onClick={onRetweetBtn}>Tweet</button>
                    </div>  
                </div>
            </div>
        </>
    );
}

export default RetweetModal;