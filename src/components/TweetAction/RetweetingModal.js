import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTimes, faImage } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storageService } from "fbase";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import TweetModalFooter from "./TweetModalFooter";

const RetweetingModal = ({ userObj, onRetweetModalToggle, retweetContent, usersProfile, setRetweetModalOpen }) => {
    const [modalRetweet, setModalRetweet] = useState();
    const [attachment, setAttachment] = useState('');

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return() => {
            document.body.style.overflow = 'auto';
        }
    }, []);

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

        if(attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            attachmentUrl = await getDownloadURL(response.ref);
        }
        
        const tweetObj = {
            text : modalRetweet,
            createdAt : Date.now(),
            userId : userObj.uid,
            userImage : userObj.photoURL,
            bundle : Number(`${retweetContent.bundle}`),
            attachmentUrl,
            parent : true,
            reply_users : [],
            like_users : [],
            retweet:true,
            retweetParentInfo : retweetContent,
            retweetParent: retweetContent.id,
            retweetAttachment : retweetContent.attachmentUrl,
            retweetText : retweetContent.text,
        }

        await addDoc(collection(db, 'tictoc'), tweetObj);
        
        setModalRetweet('');
        setAttachment('');
        setRetweetModalOpen(false);
    }    

    const parentInfo = usersProfile.filter(element => {
        return element.userId === retweetContent.userId;
    })[0];

    return(
        <>
            <div className="tweet_modal_background">
                <div className="tweet_modal_container">
                    <div className="delete_container" onClick={onRetweetModalToggle}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>

                    <div className="tweet_modal_content_container">
                        <div className="user_img_container">
                            <img src={userObj.photoURL} alt='user Image'/> 
                        </div>
                        <div className="user_tweet_container">
                            <div>
                                <input type="text" placeholder="Add a comment" className="tweet_modal_tweet_text" value={modalRetweet} onChange={onChangeModalRetweet}/>
                            </div>

                            {attachment && (
                                <div className="factoryForm__attachment">
                                    <img src={attachment} alt='attachment' style={{ backgroundImage : attachment }} />

                                    <div className="factoryForm__clear" onClick={onClearImage}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="retweet_content_container">
                        <div className="retweet_top">
                            <img src={parentInfo.userImage} alt='retweet user Image' />
                            <span>{parentInfo.displayName}</span>
                            <span className="user_email">@{parentInfo.email.split('@')[0]}</span>
                        </div>
                        <div className="retweet_content">
                            <span>{retweetContent.text}</span>
                        </div>

                        {retweetContent.attachmentUrl && (
                            <div className="retweet_img">
                                <img src={retweetContent.attachmentUrl} alt='retweet attachment' style={{ backgroundImage : retweetContent.attachmentUrl }} />
                            </div>
                        )}
                    </div>
                    
                    <TweetModalFooter onFileChange={onFileChange} onTweetBtn={onRetweetBtn} division={"RetweetModal"} />
                
                </div>
            </div>
        </>
    );
}

export default RetweetingModal;