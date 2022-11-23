import React,{ useState } from "react";
import Tictoc from "components/Tictoc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storageService } from "fbase";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";

const Details = ({ tweetDetail, setCurrentPage, userObj, usersProfile, setToastAlert, setToastText }) => {
    setCurrentPage("details");

    const [activeTweetReply, setActiveTweetReply] = useState(false);
    const [replyTweet, setReplyTweet] = useState();
    const [attachment, setAttachment] = useState('');

    const parentInfo = usersProfile.filter(element => {
        return element.userId === tweetDetail.userId;
    })[0];

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
            text : replyTweet,
            createdAt : Date.now(),
            userId : userObj.uid,
            bundle : Number(`${tweetDetail.bundle}`),
            attachmentUrl,
            userImage : userObj.photoURL,
            like_users : [],
            child : true,
            parentReplyInfo : parentInfo, 
        }

        await addDoc(collection(db, 'tictoc'), replyTweetObj);
        setReplyTweet('');
    }

    const onChangeReplyTweet = (e) => {
        const {target : {value}} = e;
        setReplyTweet(value);
    }

    return(
        <div className="container">
            <Tictoc tictoc={tweetDetail} isOwner={tweetDetail.userId === userObj.uid} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} />
            {activeTweetReply ? (
                <div className="detail_tweet_write_container_active">
                    <div className="tweet_write_active_img_container">
                        <img src={userObj.photoURL} />
                    </div>
                    
                    <div className="tweet_write_active_content_container">
                        <span>Replying to <span className="user_email">@{parentInfo.email.split('@')[0]}</span></span>
                        <div>
                            <input type="text" className="tweet_container" placeholder="Tweet your reply" value={replyTweet} onChange={onChangeReplyTweet} />
                        </div>

                        {attachment && (
                            <div className="reply_attachment">
                                <img src={attachment} style={{ backgroundImage : attachment }} />

                                <div className="reply_clear" onClick={onClearImage}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </div>
                            </div>
                        )}

                        <div className="tweet_write_active_content_footer">
                            <label htmlFor="attach-file2">
                                <FontAwesomeIcon icon={faImage} />
                            </label>
                            <input type="file" id="attach-file2" className="input_file" accept="image/*" onChange={onFileChange} />

                            <button onClick={onWriteReply}>Reply</button>
                        </div>

                    </div>
                </div>
            ) : (
                <div className="detail_tweet_write_container" onClick={() => {setActiveTweetReply(true)}}>
                    <div className="detail_tweet_write_content">
                        <img src={userObj.photoURL} />
                        <div>
                            <span>Tweet your reply</span>
                        </div>
                        <button>Reply</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Details;