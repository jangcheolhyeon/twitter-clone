import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from "firebase/storage";
import { storageService, db } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import ReplyTwit from "components/ReplyTwit";


const Tictoc = ({ tictoc, isOwner, userObj, deleteParent, setRetwitContent }) => {
    const [editing, setEditing] = useState(false);
    const [newText, setNewText] = useState(tictoc.text);

    const onDelete = async() => {
        // console.log('delete');
        // db에 글 아이디와 일치하는거 지우기
        if(tictoc.parent){
            deleteParent(tictoc.id);
            // await deleteDoc(doc(db, "tictoc", `${tictoc.id}`));
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
    const onSubmitNewText = async(event) => {
        event.preventDefault();

        await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
            text : newText
        } );
        
        toggleEditing();
    }
    

    return(
        <>
            <div className={tictoc.child ? ("nweet reply_nweet") : ("nweet")}>
                    <img src={userObj.photoURL} style={{width:"50px", height:"50px", top:"-42px", left:"10px"}} />

                {tictoc.retwitContent === null || tictoc.retwitContent === '' ? (
                    null
                ) : (
                    <div className="retwit_container">
                        <h1 className="">retwitText : {tictoc.retwitContent}</h1>
                    </div>
                )}


                {editing ? (
                    <>
                        <form onSubmit={onSubmitNewText} className="container nweetEdit">
                            <input type="text" className="formInput" placeholder="edit your twit" value={newText} onChange={onChangeNewText} required />
                            <input type="submit" value="Update tweet" className="formBtn" />
                        </form>
                        <button onClick={toggleEditing} className='formBtn cancelBtn'>Cancel</button>
                    </>
                ) : (
                    <>
                        {/* <h4>{tictoc.text}</h4> */}
                        {tictoc.child ? (
                            <h4>ㄴ{tictoc.text}</h4>
                        ) : (
                            <h4 className={tictoc.isDeleted ? "deletedText" : ''}>{tictoc.text}</h4>
                        )}
                        {tictoc.attachmentUrl && <img src={tictoc.attachmentUrl} />}
                        {isOwner && (
                            <div className="nweet__actions">
                                <button onClick={onDelete}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>

                                <button onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                            </div>
                        )}
                        <ReplyTwit parentTwit={tictoc} userObj={userObj} setRetwitContent={setRetwitContent}  />                    
                    </>
                    ) 
                }

            </div>
        </>
    );
}

export default Tictoc;