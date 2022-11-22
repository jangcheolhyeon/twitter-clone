import React, { useEffect } from "react";

const LikeToastNotification = ({ text, setToastAlert }) => {
    useEffect(() => {
        let timer = setTimeout(() => {
            setToastAlert(false);
        }, 2000);

        return () => { clearTimeout(timer) }
    }, [])


    return(
        <>
            <div className="toast_container">
                <span>{text}</span>
            </div>
        </>
    );
}

export default LikeToastNotification;