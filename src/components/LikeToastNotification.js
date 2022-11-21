import React, { useEffect } from "react";

const LikeToastNotification = ({ setLikeToast }) => {
    useEffect(() => {
        let timer = setTimeout(() => {
            setLikeToast(false);
        }, 2000);

        return () => { clearTimeout(timer) }
    }, [])


    return(
        <>
            <div className="like_toast_container">
                <span>Keep it up! The more Tweets you like, the better your timeline will be.</span>
            </div>
        </>
    );
}

export default LikeToastNotification;