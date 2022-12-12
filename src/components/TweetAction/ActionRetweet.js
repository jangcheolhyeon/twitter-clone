import React from "react";

const ActionRetweet = () => {
    return(
        <>
            <div className="action_retweet_container" ref={retweetRef} onClick={onRetweetToggle}
                onMouseOver={() => { setRetweetHover(true) }}
                onMouseOut={() => { setRetweetHover(false) }}
            >
                {retweetHover ? (
                    <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover" : "icons retweet_hover"}/>
                ) : (
                    <>
                    {replyState ? (
                            <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover retweet_state" : "icons retweet_state" } />
                        ) : (
                            <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover" : "icons" } />
                        )}
                    </>
                )}

                <span className={replyState && "retweet_state_num"}>{tictoc.reply_users.length}</span>

                {retweetHover &&
                    (
                        <div className="action_hover"> 
                            {replyState ? "undo retweet" : "retweet"}
                        </div>
                    )
                }

                {retweetActive && (
                    <div className="tictoc_active_box">
                        <ul>
                            {replyState ? (
                                <li onMouseDown={onClickReply}
                                >Undo Retweet</li>
                            ) : (
                                <li onMouseDown={onClickReply}
                                >Retweet</li>
                            )}
                            <li onClick={onRetweetModalToggle}>Quote Tweet</li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    )
}

export default ActionRetweet