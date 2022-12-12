import React from "react";
import ActionComment from "./TweetAction/ActionComment";

const TweetActions = ({ tictoc, onReplyModalToggle }) => {
    return(
        <>
            <ActionComment tictoc={tictoc} onReplyModalToggle={onReplyModalToggle} />
            
        </>
    );
}

export default TweetActions;