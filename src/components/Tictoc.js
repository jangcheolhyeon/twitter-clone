import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from "firebase/storage";
import { storageService, db } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faRightLong } from "@fortawesome/free-solid-svg-icons";

import ReplyTweet from "components/ReplyTweet";


const Tictoc = ({ tictoc, isOwner, userObj, deleteParentTweet, setRetweetContent, setRetweetState, setParentBundle }) => {
    const [editing, setEditing] = useState(false);
    const [newText, setNewText] = useState(tictoc.text);

    const onDeleteTweet = async() => {
        // db에 글 아이디와 일치하는거 지우기
        if(tictoc.parent && tictoc.RetweetContent === ''){
            deleteParentTweet(tictoc.id);
            await deleteObject(ref(storageService, `${tictoc.attachmentUrl}`));
        } else{
            await deleteDoc(doc(db, "tictoc", `${tictoc.id}`));
            await deleteObject(ref(storageService, `${tictoc.attachmentUrl}`));
        }
    }


    //토글을 통해서 input태그가 생겼다 없어졌다.
    const toggleEditing = async() => {
        setEditing((prev) => !prev);
    }

    const onChangeNewText = (e) => {
        setNewText(e.target.value);
    }

    // db에 tictoc이라는 coollection에 아이디가 일치하는거 업데이트
    const onUpdateTweetText = async(event) => {
        event.preventDefault();

        await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
            text : newText
        } );
        
        toggleEditing();
    }
    
    return(
        <>
            <div className={tictoc.child ? ("nweet reply_nweet") : ("nweet")}>
                    <img src={userObj.photoURL} className="user_photo_image" />

                {tictoc.RetweetContent && 
                    <div className="retweet_container">
                        <h1>retweetText : {tictoc.RetweetContent}</h1>
                    </div>}


                {editing ? (
                    <>
                        <form onSubmit={onUpdateTweetText} className="container nweetEdit">
                            <input type="text" className="formInput" placeholder="edit your tweet" value={newText} onChange={onChangeNewText} required />
                            <input type="submit" value="Update tweet" className="formBtn" />
                        </form>
                        <button onClick={toggleEditing} className='formBtn cancelBtn'>Cancel</button>
                    </>
                ) : (
                    <>
                        {tictoc.child ? 
                        (
                            <>
                                <div className="tweet_text">
                                    <FontAwesomeIcon icon={faRightLong} className="child_icon"/>
                                    <h4>{tictoc.text}</h4>
                                </div>
                            </>
                        ) : (
                            <div className={tictoc.isDeleted ? "deletedText tweet_text" : 'tweet_text'}>
                                <h4>{tictoc.text}</h4>
                            </div>
                        )}
                        {tictoc.attachmentUrl && <img src={tictoc.attachmentUrl} />}
                        {isOwner && (
                            <div className="nweet__actions">
                                <button onClick={onDeleteTweet}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>

                                <button onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                            </div>
                        )}

                        <ReplyTweet parentTweet={tictoc} userObj={userObj} setRetweetContent={setRetweetContent} setRetweetState={setRetweetState} setParentBundle={setParentBundle} />                    
                    </>
                    ) 
                }

            </div>
        </>
    );
}

export default Tictoc;