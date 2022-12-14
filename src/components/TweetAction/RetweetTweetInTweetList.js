import React from "react";

const RetweetTweetInTweetList = ({ currentPage, onTweetClick, tictoc, usersProfile }) => {
    let retweetParentInfo;
    if(tictoc.retweet !== undefined && tictoc.retweet === true){
        retweetParentInfo = usersProfile.filter(element => element.userId === tictoc.retweetParentInfo.userId)[0];
    }

    return(
        <>
            <div className="tictoc_retweet_content_container">
                <div className={currentPage === "details" || currentPage === "profile" ? "retweet_content_container tweet_home" : "retweet_content_container"} onClick={currentPage === "details" ? onTweetClick : undefined}>
                    <div className="retweet_top">
                        <img src={retweetParentInfo.userImage} alt='retweet user Image' />
                        <span>{retweetParentInfo.displayName}</span>
                        <span className="user_email">@{retweetParentInfo.email.split('@')[0]}</span>
                    </div>
                    <div className="retweet_content">
                        <span>{tictoc.retweetText}</span>
                    </div>

                    {tictoc.retweetAttachment && (
                        <div className="retweet_img">
                            <img src={tictoc.retweetAttachment} style={{ backgroundImage : tictoc.retweetAttachment }} alt='retweet user Image' />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default RetweetTweetInTweetList;