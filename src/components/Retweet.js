import React from "react";

const Retweet = ({ RetweetContent, setRetweetContent, setRetweetState }) => {
    
    const onCloseRetweet = () => {
        setRetweetContent('');
        setRetweetState(false);
    }

    return(
        <div className="retweet_container">
            <h1 className="retweet_header">Retweet</h1>
            <div className="retweet_content_container">
                <div className="close_retweet_container">
                    <span className="close_retweet_btn" onClick={onCloseRetweet} >X</span>
                </div>
                <div className="retweet_text_container">
                    <h1>{RetweetContent}</h1>
                </div>
            </div>
        </div>
    );
}

export default Retweet;