import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "fbase";

const ActionComment = ({ tictoc, onReplyModalToggle }) => {
    const [commentHover, setCommentHover] = useState(false);
    const [replyList, setReplyList] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "tictoc"));
        onSnapshot(q, (snapshot) => {
            const comments = snapshot.docs.map((doc) => {
                return {
                    id : doc.id,
                    ...doc.data(),
                }
            })
            setReplyList(comments.filter(element => {return element.child === true}));
        })
    }, [])
    
    return(
        <>
            <div className="action_comment_container" 
                onMouseOver={() => { setCommentHover(true) }}
                onMouseOut={() => { setCommentHover(false) }}
                onClick={onReplyModalToggle}
            >
                {commentHover ? (
                    <FontAwesomeIcon icon={faCommentDots} className="icons comment_dots_hover" />
                ) : (
                    <FontAwesomeIcon icon={faCommentDots} className="icons" />
                )}
                <span>{replyList.filter(element => { return element.parentReplyInfoDetail.id === tictoc.id }).length}</span>
                {commentHover && 
                    (
                        <div className="action_hover"> 
                            Reply
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default ActionComment;