import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

const ActionShare = () => {
    const [shareHover, setShareHover] = useState(false);
    const [shareActive, setShareActive] = useState(false);
    const shareRef = useRef();


    useEffect(() => {
        document.addEventListener("mousedown", shareOutSide);
        return () => {
            document.removeEventListener("mousedown", shareOutSide);
        }
    }, [shareActive])
    
    const onShareToggle = (event) => {
        event.stopPropagation();
        setShareActive((prev) => !prev);
    }

    const shareOutSide = (event) => {
        if(shareActive && !event.path.includes(shareRef.current)){
            onShareToggle(event);
        }
    }


    const onClickCopyLink = (text) => {
        navigator.clipboard.writeText(text);
        setShareHover(false);
    }

    return(
        <>
            <div className="action_share_container"
                onMouseOver={() => { setShareHover(true) }}
                onMouseOut={() => { setShareHover(false) }}
            >
                {shareHover ? (
                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon share_hover" ref={shareRef} onClick={onShareToggle}/>
                ) : (
                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon" ref={shareRef} onClick={onShareToggle}/>
                )}

                {shareHover && (
                    <div className="action_hover">
                        share
                    </div>
                )}

                {shareActive && (
                    <div className="tictoc_active_box">
                        <ul>
                            <li onMouseDown={() => onClickCopyLink('www.abc.com')}>Copy link to Tweet</li>
                            <li>share Tweet</li>
                            <li>BookMark</li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default ActionShare;