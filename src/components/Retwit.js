import React from "react";

const Retwit = ({ retwitContent, setRetwitContent }) => {
    
    const onCloseRetwit = () => {
        setRetwitContent('');
    }

    return(
        <>
            <h1 className="retwit_header">Retwit</h1>
            <div className="retwit_container">
                <div className="close_retwit_container">
                    <span className="close_retwit_btn" onClick={onCloseRetwit} >X</span>
                </div>
                <div className="retwit_text_container">
                    <h1>{retwitContent}</h1>
                </div>
            </div>
        </>
    );
}

export default Retwit;