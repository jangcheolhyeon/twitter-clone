import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection } from "firebase/firestore";
import { db, storageService } from "fbase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const ReplyModal = ({ userObj, onReplyModalToggle, parentTweet, usersProfile, setReplyModalOpen }) => {
    const [modalTweet, setModalTweet] = useState();
    const [attachment, setAttachment] = useState('');

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return() => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    const parentInfo = usersProfile.filter(element => {
        return element.userId === parentTweet.userId;
    })[0];

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
    

    const onWriteReply = async(e) => {
        let attachmentUrl = ""

        if(attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            attachmentUrl = await getDownloadURL(response.ref);
        }

        const replyTweetObj = {
            text : modalTweet,
            createdAt : Date.now(),
            userId : userObj.uid,
            bundle : Number(`${parentTweet.bundle}`),
            attachmentUrl,
            userImage : userObj.photoURL,
            reply_users : [],
            like_users : [],
            child : true,
            parentReplyInfo : parentInfo, 
            parentReplyInfoDetail: parentTweet,
        }

        await addDoc(collection(db, 'tictoc'), replyTweetObj);
        setModalTweet('');
        setReplyModalOpen(false);
    }

    return(
        <div className="tweet_modal_background">
            <div className="tweet_modal_container">
                <div className="delete_container" onClick={onReplyModalToggle}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>

                <div className="parent_tweet_info">
                    <div className="parent_img_container">
                        <img src={parentInfo.userImage} />
                    </div>
                    <div className="parent_text_contaienr">
                        <span className="user_name">{parentInfo.displayName}</span>
                        <span className="user_tweet">{parentTweet.text}</span>
                        {parentTweet.attachmentUrl && (
                            <div className="reply_attachment">
                                <img src={parentTweet.attachmentUrl} style={{ backgroundImage : attachment }} />
                            </div>
                        )}
                        <span className="user_reply_info">Replying to <span className="user_email">{parentInfo.email}</span></span>
                    </div> 
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
                            <div className="reply_attachment">
                                <img src={attachment} style={{ backgroundImage : attachment }} />

                                <div className="reply_clear" onClick={onClearImage}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="tweet_modal_container_footer">
                    <label htmlFor="attach-file1">
                        <FontAwesomeIcon icon={faImage} />
                    </label>
                    <input type="file" id="attach-file1" accept="image/*" onChange={onFileChange} />

                    <button onClick={onWriteReply}>Tweet</button>
                </div>  
            </div>
        </div>
    )
}

export default ReplyModal;