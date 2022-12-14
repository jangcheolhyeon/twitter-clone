import EmailHoverInTweet from "components/TweetAction/EmailHoverInTweet";
import FollowAction from "components/TweetAction/FollowAction";
import { db } from "fbase";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";


const RecommendFriend = ({ user, userObj, usersProfile, emailHoverState }) => {
    const [followingHover, setFollowingHover] = useState(false);
    const [followState, setFollowState] = useState(true);

    let currentUser;

    useEffect(() => {
        if(usersProfile === undefined || usersProfile === null || usersProfile.length === 0){
            return;
        }

        getFollowInit();
    }, [])    

    useEffect(() => {
        getFollowInit();
    }, [usersProfile])
        
    const getFollowInit = () => {
        let isFollow;
        if(usersProfile.filter(element => element.userId === userObj.uid).length === 0){
            isFollow = false;
        }else{
            isFollow = usersProfile.filter(element => element.userId === userObj.uid)[0].follower.includes(user.userId);
        }
        
        if(isFollow){
            setFollowState(true);
        } else{
            setFollowState(false);
        }

        currentUser = usersProfile.filter(element => element.userId === userObj.uid)[0];
    } 

    const onFollowClick = async(user) => {
        setFollowState(prev => !prev);
        currentUser = usersProfile.filter(element => element.userId === userObj.uid)[0];

        if(followState){
            await updateDoc(doc(db, "usersInfo", `${currentUser.id}`), {
                follower : currentUser.follower.filter(element => {
                    return element !== user.userId
                })
            });   

            await updateDoc(doc(db, 'usersInfo', user.id), {
                following : user.following.filter(element => {
                    return element !== currentUser.userId
                })
            })
                        
        } else{
            await updateDoc(doc(db, 'usersInfo', `${currentUser.id}`), {
                follower : [...currentUser.follower, user.userId],
            });

            await updateDoc(doc(db, 'usersInfo', user.id), {
                following : [...user.following, currentUser.userId]
            })
        }
    }

    return(
        <li className="recommend_item">
            {emailHoverState ? (
                <EmailHoverInTweet 
                    user={user} 
                    userObj={userObj} 
                    followState={followState} 
                    followingHover={followingHover} 
                    setFollowingHover={setFollowingHover} 
                    onFollowClick={onFollowClick} 
                />
            ) : (
                <>
                    <div className="user_image_container">
                        <img src={user.userImage} alt='user Image' />
                    </div>

                    <div className="user_display_name">
                        <span>{user.displayName}</span>
                    </div>

                    <FollowAction user={user} followState={followState} followingHover={followingHover} onFollowClick={onFollowClick} setFollowingHover={setFollowingHover} />
                </>
            )}
        </li>
    );
}

export default RecommendFriend;