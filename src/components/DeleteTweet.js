import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db, storageService } from "fbase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "components/DeleteModal";
import { useNavigate } from "react-router-dom";


const DeleteTweet = ({ tictoc, setToastAlert, setToastText, setCurrentPage }) => {
    const [xMarkHover, setXMarkHover] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const navi = useNavigate();

    const onDeleteModalCancel = (event) => {
        event.stopPropagation();
        setDeleteModal(false);
    }  

    const onDeleteModal = (event) => {
        event.stopPropagation();
        setDeleteModal(true);
    }

    const onDeleteTweet = async(event) => {
        event.stopPropagation();
        setToastAlert(true);
        setToastText('Your Tweet was Deleted');

        window.scrollTo({top:0, behavior:'smooth'});
        setCurrentPage("home");
        navi('/');
        
        await deleteDoc(doc(db, "tictoc", `${tictoc.id}`));
        if(tictoc.attachmentUrl !== null || tictoc.attachmentUrl !== ""){
            await deleteObject(ref(storageService, `${tictoc.attachmentUrl}`));
        }
    }

    return(
        <>
        {deleteModal && <DeleteModal onDeleteTweet={onDeleteTweet} onDeleteModalCancel={onDeleteModalCancel} />}
            <>
                <FontAwesomeIcon icon={faXmark} 
                    onMouseOver={() => { setXMarkHover(true) }}
                    onMouseOut={() => { setXMarkHover(false) }}
                    onClick={onDeleteModal}
                    className="x_mark_icon"
                />
                {xMarkHover && 
                    (
                        <div className="action_hover"> 
                            remove
                        </div>
                    )
                }
            </>
        </>
    );
}

export default DeleteTweet;