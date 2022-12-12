import React, { useEffect, useRef, useState } from "react";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "fbase";

const TweetThreeDots = ({ isOwner, userInfo, tictoc }) => {
    const [threedotsHover, setThreedotsHover] = useState(false);
    const [threedotsActive, setThreedotsActive] = useState(false);
    const dotsRef = useRef();

    const onThreedotsToggle = (event) => {
        event.stopPropagation();
        setThreedotsActive((prev) => !prev);
    }

    const threedotsOutSide = (event) => {
        if(threedotsActive && !event.path.includes(dotsRef.current)){
            onThreedotsToggle(event);
        }
    }

    const handlePinActive = async() => {
        if(userInfo.pin === tictoc.id){
            await updateDoc(doc(db, "usersInfo", `${userInfo.id}`), {
                pin : ""
            });            
        }
        else{
            await updateDoc(doc(db, "usersInfo", `${userInfo.id}`), {
                pin : tictoc.id
            });
        }

    }


    useEffect(() => {
        document.addEventListener("mousedown", threedotsOutSide);
        return () => {
            document.removeEventListener("mousedown", threedotsOutSide);
        }
    }, [threedotsActive])

    return(
        <>
            <FontAwesomeIcon icon={faEllipsis} className='three-dots-icon'
                onMouseOver={() => { setThreedotsHover(true) }}
                onMouseOut={() => { setThreedotsHover(false) }}
                onClick={onThreedotsToggle}
                ref={dotsRef}
            />

            {threedotsHover && 
                (
                    <div className="action_hover">
                        more
                    </div>
                )
            }

            {threedotsActive && 
                (
                    <div className="tictoc_active_box threedots_active_container" >
                        <ul>
                            {isOwner ? 
                                (
                                    <>
                                        <li onMouseDown={handlePinActive}>Pin to your profile</li>
                                        <li>change who can reply</li>
                                    </>
                                )
                                :
                                (<>
                                    <li>Follow</li>
                                    <li>Block</li>
                                    <li>Mute</li>
                                </>)
                            }
                        </ul>
                    </div>
                )
            }
        </>
    );
}

export default TweetThreeDots;