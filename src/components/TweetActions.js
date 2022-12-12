import React from "react";
import ActionComment from "./TweetAction/ActionComment";
import ActionLike from "./TweetAction/ActionLike";
import ActionRetweet from "./TweetAction/ActionRetweet";

const TweetActions = ({ tictoc, userObj, onReplyModalToggle, retweetHover, setRetweetHover, retweetActive, setRetweetActive, onRetweetModalToggle, setToastAlert, setToastText }) => {
    return(
        <>
            <ActionComment tictoc={tictoc} onReplyModalToggle={onReplyModalToggle} />
            <ActionRetweet tictoc={tictoc} userObj={userObj} retweetHover={retweetHover} setRetweetHover={setRetweetHover} retweetActive={retweetActive} setRetweetActive={setRetweetActive} onRetweetModalToggle={onRetweetModalToggle} setToastAlert={setToastAlert} setToastText={setToastText} /> 
            <ActionLike tictoc={tictoc} userObj={userObj} setToastAlert={setToastAlert} setToastText={setToastText} />
        </>
    );
}



export default TweetActions;