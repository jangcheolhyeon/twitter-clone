import React from "react";
import ActionComment from "components/TweetAction/TweetActionReply";
import ActionLike from "components/TweetAction/TweetActionLike";
import ActionRetweet from "components/TweetAction/TweetActionRetweet";
import ActionShare from "components/TweetAction/TweetActionShare";

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