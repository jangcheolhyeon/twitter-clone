import React, { useRef } from "react";
import UserInfoHover from "components/TweetAction/UserInfoHover";

const ReplyingTweet = ({ tictoc, emailHover, setEmailHover, userObj, usersProfile, setUsersProfile }) => {
    const emailTimer = useRef();
    let replyParentInfo;
    if(tictoc.child !== undefined && tictoc.child === true){
        replyParentInfo = usersProfile.filter(element => element.userId === tictoc.parentReplyInfo.userId)[0]
    }
    return(
        <>
            {tictoc.parent && <span>{tictoc.text}</span>}
            {tictoc.child && 
                <div className="reply_content">
                    <span className='replying'>Replying to 
                        <span className={emailHover ? 'user_email activing_user_email' : 'user_email'}
                            onMouseOver={() => { setEmailHover(true); }} 
                            onMouseOut={() => { emailTimer.current = setTimeout(() => {
                                setEmailHover(false);
                            }, 500) }}
                        >
                            @{replyParentInfo.email.split('@')[0]}
                        </span>
                    </span>

                    <span className="text">{tictoc.text}</span>
                </div>
            }
            
            {emailHover && 
                <UserInfoHover userInfo={replyParentInfo} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} timerRef={emailTimer} setUserInfoHover={setEmailHover} isUserImgHover={false}/>
            }
        </>
    );
}

export default ReplyingTweet;