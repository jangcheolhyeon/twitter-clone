import React from "react";
import ActionComment from "./TweetAction/ActionComment";
import ActionRetweet from "./TweetAction/ActionRetweet";

const TweetActions = ({ tictoc, userObj, onReplyModalToggle, retweetHover, setRetweetHover, retweetActive, setRetweetActive, onRetweetModalToggle, setToastAlert, setToastText }) => {
    return(
        <>
            <ActionComment tictoc={tictoc} onReplyModalToggle={onReplyModalToggle} />
            <ActionRetweet tictoc={tictoc} userObj={userObj} retweetHover={retweetHover} setRetweetHover={setRetweetHover} retweetActive={retweetActive} setRetweetActive={setRetweetActive} onRetweetModalToggle={onRetweetModalToggle} setToastAlert={setToastAlert} setToastText={setToastText} /> 
        </>
    );
}

export default TweetActions;