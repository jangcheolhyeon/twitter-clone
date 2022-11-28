import Tweet from "components/Tweet";
import React, { useEffect, useState } from "react";

const ProfileNaviLikes = ({ userObj, tweets, usersProfile, setToastAlert, setToastText }) => {
    const [myLikeList, setMyLikeList] = useState([]);

    useEffect(() => {
        setMyLikeList(tweets.filter(element => element.like_users.includes(userObj.uid)));
    }, [])

    if(!tweets || !myLikeList){
        return null;
    }

    return(
        <>
            {Boolean(myLikeList.length) ? (
                <>
                    {myLikeList.map(element => {
                        return <Tweet tictoc={element} isOwner={true} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} />
                    })}
                </>
            ) : (
                <>
                    <div className="like_container">
                        <div className="like_container_content">
                            <span className="like_content_top">You don't have any likes yet</span>
                            <span className="text">Tap the heart on any Tweet to show it some love. When you do, it’ll show up here.</span>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ProfileNaviLikes;