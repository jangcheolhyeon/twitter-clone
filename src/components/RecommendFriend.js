import { isReactNative } from "@firebase/util";
import { db } from "fbase";
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";


const RecommendFriend = ({ user, userObj, usersProfile, setUsersProfile }) => {
    const [followState, setFollowState] = useState(false);
    const [followingHover, setFollowingHover] = useState(false);
    let currentUser;
    
    useEffect(() => {
        const q = query(collection(db, 'usersInfo'));
        onSnapshot(q, (snapshot) => {
            const newUsersInfo = snapshot.docs.map((doc) => {
                return {
                    id : doc.id,
                    ...doc.data(),
                }
            });
            setUsersProfile(newUsersInfo);
        })
    }, [followState])

    useEffect(() => {
        const isFollow = usersProfile.filter(element => element.userId === userObj.uid)[0].follower.includes(user.userId);
        if(isFollow){
            setFollowState(true);
        } else{
            setFollowState(false);
        }
        
    },[])

    currentUser = usersProfile.filter(element => element.userId === userObj.uid)[0];

    const onFollowClick = async(user) => {
        setFollowState(prev => !prev);
        console.log("clickUser", user);
        console.log("currentUser", currentUser);

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
            <div className="user_image_container">
                <img src={user.userImage} />
            </div>
            <div className="user_display_name">
                <span>{user.displayName}</span>
            </div>
            <div className="recommend_contaienr_follow_box">
                {followState ? (
                    followingHover ? (
                        <button className="recommend_friend_follow_btn" onClick={() => {onFollowClick(user)}} onMouseOver={() => setFollowingHover(true)} onMouseOut={() => setFollowingHover(false)}>UnFollow</button>
                    ) : (
                        <button className="recommend_friend_follow_btn" onClick={() => {onFollowClick(user)}} onMouseOver={() => setFollowingHover(true)} onMouseOut={() => setFollowingHover(false)}>Following</button>
                    )
                ) : (
                    <button className="recommend_friend_unfollow_btn" onClick={() => {onFollowClick(user)}}>Follow</button>
                )}
            </div>
        </li>
    );
}

export default RecommendFriend;