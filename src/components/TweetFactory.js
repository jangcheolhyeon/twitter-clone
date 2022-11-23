import React, { useState } from "react";
import { db, storageService } from 'fbase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { collection, addDoc } from "firebase/firestore"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faImage } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({ userObj, retweetState, parentBundle }) => {
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

        
        const tweetObj = {
            text : message,
            createdAt : Date.now(),
            userId : userObj.uid,
            userImage : userObj.photoURL,
            attachmentUrl,
            bundle:retweetBundle,
            like_users: [],
            parent : true,
            reply_cnt : 0,
            isDeleted : false,
        }

        // db에 tictoc이라는 컬렉션에 추가 twitObj 객체 추가
        await addDoc(collection(db, 'tictoc'), tweetObj);

        setMessage('');
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
    
    const onClearImage = () => {
        setAttachment('');
    }


    return(
        <>
            <form className="factoryForm" onSubmit={onSubmit}>
                <div className="user_image_container">
                    <img src={userObj.photoURL} />
                </div>

                <div className="tweet_input_container">
                    <input type="text" placeholder="what's happening?" value={message} onChange={onChange} className="factoryInput__input" />

                    {attachment && (
                        <div className="factoryForm__attachment">
                            <img src={attachment} style={{ backgroundImage : attachment }} />

                            <div className="factoryForm__clear" onClick={onClearImage}>
                                <FontAwesomeIcon icon={faTimes} />
                            </div>
                        </div>
                    )}

                    <div className="tweet_footer">
                        <label htmlFor="attach-file" className="factoryInput__label">
                            <FontAwesomeIcon icon={faImage} className="input_image_icon" />
                        </label>
                        <input type="file" id="attach-file" accept='image/*' onChange={onFileChange} className="file_upload_input" />

                        <div className="factory_input_tweet">
                            <button>Tweet</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default TweetFactory;