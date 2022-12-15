import React, { useEffect, useState } from 'react';
import UserHistory from 'components/Profile/UserHistoryInProfile';
import UpdateUserProfile from 'components/Profile/UpdateUserProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const Profile = ({ userObj, messages, currentPage, refreshUserObj, usersProfile, setCurrentPage, setToastAlert, setToastText, setUsersProfile, setTweetDetail }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [userBackgroundAttachment, setUserBackgroundAttachment] = useState(null);
    const [changedUserBackgroundAttachment, setChangedUserBackgroundAttachment] = useState(null);
    const [myTweetList, setMyTweetList] = useState(null);
    const [tweets, setTweets] = useState([]);
    const [followersCnt, setFollowersCnt] = useState(0);
    const [followingCnt, setFollowingCnt] = useState(0);

    let currentUser;
    
    const getMyTweets = () => {    
        setMyTweetList(messages.filter(element => {
            return element.userId === userObj.uid;
        }))
        setTweets(messages);
        
    }

    const sortTweetList = () => {
        if(usersProfile.length === 0) return null;
        if(myTweetList === null) return null;
        
        let isPin = usersProfile.filter(element => element.userId === userObj.uid)[0];

        if(isPin.pin.length !== 0){
            let pinIndex = myTweetList.findIndex(element => element.id === isPin.pin);
            let changeMessages = [...myTweetList];
            
            changeMessages.splice(pinIndex, 1);
            let pinContent = myTweetList.filter(element => element.id === isPin.pin)[0];
            changeMessages.unshift(pinContent);
            setMyTweetList(changeMessages);
        } else if(isPin.pin.length ===0){
            getMyTweets();
        }
    }

    useEffect(() => {
        sortTweetList();
    }, [tweets])

    useEffect(() => {
        createAccountUser();

        getMyTweets();
        if(!currentUser && usersProfile.length !== 0){
            let newUsersProfile = [...usersProfile, {
                userId : userObj.uid,
                userImage : userObj.photoURL,
                displayName : userObj.displayName,
                email : userObj.email,
                pin : '',
                follower:[],
                following:[],
            }];
            setUsersProfile(newUsersProfile);
        }
        setCurrentPage('profile');

    }, []);
    
    useEffect(() => {
        getMyTweets();
        sortTweetList();
    }, [currentPage])

    useEffect(() => {
        sortTweetList();
    }, [usersProfile])
        
    useEffect(() => {
        if(usersProfile.length === 0) return;
        currentUser = usersProfile.filter(element => element.userId === userObj.uid)[0];

        setFollowersCnt(currentUser.follower.length);
        setFollowingCnt(currentUser.following.length);
    }, [usersProfile]) 

    const createAccountUser = () => {
        if(userObj.displayName === null){
            userObj.displayName = userObj.email.split('@')[0];
        }
    }

    return(
        <>
            {myTweetList === null || usersProfile.length === 0 ? (
                <div className='container'>
                </div>
            ) : (
                <>
                    <div className='container'>
                        <div className='background_container'>
                            {userBackgroundAttachment && (
                                <img src={changedUserBackgroundAttachment} />
                            )}
                        </div>

                        <div className='my_profile_container'>
                            <div className='my_profile_container_top'>
                                {userObj.photoURL ? (
                                    <img src={userObj.photoURL} />
                                ) : (
                                    <FontAwesomeIcon icon={faCircleUser} />
                                )}
                                <UpdateUserProfile 
                                    userObj={userObj} 
                                    usersProfile={usersProfile}
                                    setUsersProfile={setUsersProfile}
                                    userBackgroundAttachment={userBackgroundAttachment}
                                    setUserBackgroundAttachment={setUserBackgroundAttachment}
                                    setChangedUserBackgroundAttachment={setChangedUserBackgroundAttachment}
                                    newDisplayName={newDisplayName}
                                    setNewDisplayName={setNewDisplayName}
                                    refreshUserObj={refreshUserObj}
                            
                                />
                            </div>
                        </div>

                        <div className='my_profile_info_container'>
                            <span className='user_name'>{userObj.displayName}</span>
                            <span className='user_email'>{userObj.email}</span>
                            <div className='follow_follower_info'>
                                <span>
                                    <span className='number'>{followingCnt}</span> Following
                                </span>
                                <span>
                                    <span className='number'>{followersCnt}</span> Followers
                                </span>
                            </div>
                        </div>
                        

                        <UserHistory 
                            usersProfile={usersProfile} 
                            userObj={userObj} 
                            myTweetList={myTweetList}
                            setToastAlert={setToastAlert}
                            setToastText={setToastText}
                            setUsersProfile={setUsersProfile}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setTweetDetail={setTweetDetail}
                            tweets={tweets}                        
                        />

                    </div>
                </>
            )}
        </>


    );
}

export default Profile;