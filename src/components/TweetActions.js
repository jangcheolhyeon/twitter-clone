import React from "react";
import ActionComment from "components/TweetAction/ActionComment";
import ActionLike from "components/TweetAction/ActionLike";
import ActionRetweet from "components/TweetAction/ActionRetweet";
import ActionShare from "components/TweetAction/ActionShare";

const TweetActions = ({ tictoc, userObj, onReplyModalToggle, retweetHover, setRetweetHover, retweetActive, setRetweetActive, onRetweetModalToggle, setToastAlert, setToastText }) => {
    return(
        <>
            <ActionComment tictoc={tictoc} onReplyModalToggle={onReplyModalToggle} />
            <ActionRetweet tictoc={tictoc} userObj={userObj} retweetHover={retweetHover} setRetweetHover={setRetweetHover} retweetActive={retweetActive} setRetweetActive={setRetweetActive} onRetweetModalToggle={onRetweetModalToggle} setToastAlert={setToastAlert} setToastText={setToastText} /> 
            <ActionLike tictoc={tictoc} userObj={userObj} setToastAlert={setToastAlert} setToastText={setToastText} />
            <ActionShare />
        </>
    );
}



export default TweetActions;