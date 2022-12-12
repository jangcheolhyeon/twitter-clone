import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "fbase";
import { doc, updateDoc } from "firebase/firestore";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";

const ActionRetweet = ({ tictoc, userObj, retweetHover, setRetweetHover, retweetActive, setRetweetActive, onRetweetModalToggle, setToastAlert, setToastText }) => {
    const retweetRef = useRef();
    const [replyState, setReplyState] = useState(false);
    

    useEffect(() => {

        setReplyState(replyStateInit())
    }, [])

    useEffect(() => {
        document.addEventListener("mousedown", reTweetOutSide);
        return () => {
            document.removeEventListener("mousedown", reTweetOutSide);
        }
    }, [retweetActive])

    const onRetweetToggle = (event) => {
        event.stopPropagation();
        setRetweetHover(false);
        setRetweetActive((prev) => !prev);
    }

    const reTweetOutSide = (event) => {
        if(retweetActive && !event.path.includes(retweetRef.current)){
            onRetweetToggle(event);
        }
    }

    const replyStateInit = () => {
        if(tictoc.reply_users.includes(userObj.uid)){
            return true;
        }

        return false;
    }

    const onClickReply = async(event) => {
        event.stopPropagation();
        if(tictoc.isDeleted) {
            return ;
        }

        if(replyState){
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                reply_users : tictoc.reply_users.filter((element) => { return element !== userObj.uid})
            })

            setReplyState((prev) => {
                return prev - 1;
            })
            
        } else {
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                reply_users : [...tictoc.reply_users, userObj.uid]
            })

            setReplyState((prev) => {
                return prev + 1;
            })
            
            setToastAlert(true);
            setToastText('Keep it up! Retweet suceess!');
        }
    }

    return(
        <>
            <div className="action_retweet_container" ref={retweetRef} onClick={onRetweetToggle}
                onMouseOver={() => { setRetweetHover(true) }}
                onMouseOut={() => { setRetweetHover(false) }}
            >
                {retweetHover ? (
                    <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover" : "icons retweet_hover"}/>
                ) : (
                    <>
                    {replyState ? (
                            <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover retweet_state" : "icons retweet_state" } />
                        ) : (
                            <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover" : "icons" } />
                        )}
                    </>
                )}

                <span className={replyState && "retweet_state_num"}>{tictoc.reply_users.length}</span>

                {retweetHover &&
                    (
                        <div className="action_hover"> 
                            {replyState ? "undo retweet" : "retweet"}
                        </div>
                    )
                }

                {retweetActive && (
                    <div className="tictoc_active_box">
                        <ul>
                            {replyState ? (
                                <li onMouseDown={onClickReply}
                                >Undo Retweet</li>
                            ) : (
                                <li onMouseDown={onClickReply}
                                >Retweet</li>
                            )}
                            <li onClick={onRetweetModalToggle}>Quote Tweet</li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    )
}

export default ActionRetweet