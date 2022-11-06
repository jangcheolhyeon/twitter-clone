import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from "firebase/storage";
import { storageService, db } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


const Tictoc = ({ tictoc, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newText, setNewText] = useState(tictoc.text);

    const onDelete = async() => {
        console.log('delete');
        // db에 글 아이디와 일치하는거 지우기
        await deleteDoc(doc(db, "tictoc", `${tictoc.id}`));

        //storage에 있는 attchmentURL과 동일한거 지우기
        await deleteObject(ref(storageService, `${tictoc.attachmentUrl}`));

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
        event.preventDefualt();
        await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
            text : newText
        } );
        
        toggleEditing();
    }

    return(
        // <div className="nweet">
        //     {editing ? (
        //         <>
        //             {isOwner && 
        //                 <>
        //                     <input type="text" value={newText} onChange={onChangeNewText}/>
        //                     <button onClick={onSubmitNewText}>chnage</button>
        //                     <button onClick={toggleEditing}>cancel</button>
        //                 </>
        //             }
        //         </>
        //     ) : (
        //         <>
        //             <h4 key={tictoc.id}>{tictoc.text}</h4>
        //             {tictoc.attachmentUrl && <img src={tictoc.attachmentUrl} style={{width:"50px", height:"50px"}} />}
        //             {isOwner && 
        //                 <>
        //                     <button onClick={toggleEditing}>EditButton</button>
        //                     <button onClick={onDelete}>DeleteButton</button>
        //                 </>
        //             }
        //         </>
        //     )}
        // </div>

        <div className="nweet">
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
                    <h4>{tictoc.text}</h4>
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
                </>
            ) 
            }
        </div>
    );
}

export default Tictoc;