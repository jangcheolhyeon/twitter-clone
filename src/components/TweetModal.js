import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection } from "firebase/firestore";
import { db, storageService } from "fbase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const TweetModal = ({ userObj, onTweetModalToggle, retweetState, parentBundle }) => {
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

        if(attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            attachmentUrl = await getDownloadURL(response.ref);
        }

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
            like_users : [],
            parent : true,
            reply_cnt : 0,
            isDeleted : false,
        }
        await addDoc(collection(db, 'tictoc'), tweetObj);

        onTweetModalToggle();
        setModalTweet('');
        setAttachment('');
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