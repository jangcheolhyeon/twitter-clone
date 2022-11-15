import React, { useState } from "react";
import { db, storageService } from 'fbase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { collection, addDoc } from "firebase/firestore"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({ userObj, RetweetContent, setRetweetContent, retweetState, parentBundle }) => {
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState('');

    const onChange = (e) => {
        setMessage(e.target.value);
    }

    const onSubmit = async(e) => {
        if(message === ""){
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

        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);

        
        const tweetObj = {
            text : message,
            // createdAt : Date.now(),
            createdAt : today,
            userId : userObj.uid,
            userImage : userObj.photoURL,
            attachmentUrl,
            // bundle : Date.now(),
            bundle:retweetBundle,
            like_users: [],
            parent : true,
            reply_cnt : 0,
            isDeleted : false,
            RetweetContent,
        }

        // db에 tictoc이라는 컬렉션에 추가 twitObj 객체 추가
        await addDoc(collection(db, 'tictoc'), tweetObj);

        setMessage('');
        setAttachment('');
        setRetweetContent('');
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
    
    const onClearImage = () => {
        setAttachment('');
    }


    return(
        <>
            <img src={userObj.photoURL} className='user_photo_image' />
            <form onSubmit={onSubmit} className="factoryForm">
                <div className="factoryInput__container">
                    <input type="text" className="factoryInput__input" placeholder='whats your mind' value={message} onChange={onChange} />
                    <input type="submit" value="&rarr;" className="factoryInput__arrow" />
                </div>

                <label htmlFor="attach-file" className="factoryInput__label">
                    <span>Add photo</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>
                <input type="file" id="attach-file" accept='image/*' onChange={onFileChange} className="file_upload_input" />

                {attachment && (
                    <div className="factoryForm__attachment">
                        <img src={attachment} style={{ backgroundImage : attachment }} />

                        <div className="factoryForm__clear" onClick={onClearImage}>
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                )}
            </form>
        </>
    );
}

export default TweetFactory;