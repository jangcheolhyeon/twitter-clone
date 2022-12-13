import { updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { updateDoc, doc } from "firebase/firestore";
import { authService, db, storageService } from 'fbase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import ProfileNaviTweets from 'components/Profile/ProfileNaviTweets';
import ProfileNaviTweets_Replies from 'components/Profile/ProfileNaviTweets_Replies';
import ProfileNaviMedia from 'components/Profile/ProfileNaviMedia';
import ProfileNaviLikes from 'components/Profile/ProfileNaviLikes';
import ModalUpdateProfile from 'components/Profile/ModalUpdateProfile';
import UserHistory from 'components/Profile/UserHistory';

const Profile = ({ userObj, messages, currentPage, refreshUserObj, usersProfile, setCurrentPage, setToastAlert, setToastText, setUsersProfile, setTweetDetail }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [userAttachment, setUserAttachment] = useState(userObj.photoURL);
    const [userBackgroundAttachment, setUserBackgroundAttachment] = useState(null);
    const [changedUserBackgroundAttachment, setChangedUserBackgroundAttachment] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [myTweetList, setMyTweetList] = useState(null);
    const [tweets, setTweets] = useState([]);

    let currentUser;

    const [followersCnt, setFollowersCnt] = useState(0);
    const [followingCnt, setFollowingCnt] = useState(0);

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

    const onChangeUserProfile = async(event) => {
        event.preventDefault();
        onUpdateUserImg();
        onUpdateUserBackground();
        if(newDisplayName !== userObj.displayName){
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            const currentUserId = usersProfile.filter(element => element.userId === userObj.uid)[0];

            await updateDoc(doc(db, 'usersInfo', currentUserId.id), {
                displayName : userObj.displayName
            })
                        
            refreshUserObj();
        }
        setModalOpen((prev) => !prev);
    }

    useEffect(() => {
        const newUsersProfile = usersProfile.map(element => {
            if(element.userId === userObj.uid){
                return {...element, displayName : userObj.displayName}
            } else{
                return element;
            }
        })
        setUsersProfile(newUsersProfile);
    }, [modalOpen])

    useEffect(() => {
        createAccountUser();
        
        if(userObj.photoURL !== '' || userObj.photoURL !== null){
            setUserAttachment(userObj.photoURL);
        }
        
        currentUser = usersProfile.filter(element => element.userId === userObj.uid)[0];
        setUserBackgroundAttachment(currentUser.backgroundImg);
        setChangedUserBackgroundAttachment(currentUser.backgroundImg);

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
    }, [usersProfile,])

    const onChangeDisplayName = (event) => {
        const {target : {value}} = event;
        setNewDisplayName(value);
    }
        

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

    const onUserAttachment = (e) => {
        const {target : { files }} = e;
        
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent;
            setUserAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onUserBackgroundAttachment = (e) => {
        const {target : {files}} = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent;
            setUserBackgroundAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onUpdateUserImg = async() => {
        let attachmentUrl = "";

        const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const response = await uploadString(attachmentRef, userAttachment, "data_url" );
        attachmentUrl = await getDownloadURL(response.ref);

        if(userAttachment !== userObj.userImage){
            await updateProfile(authService.currentUser, {photoURL: attachmentUrl});
            await updateDoc(doc(db, 'usersInfo', `${usersProfile.filter(element => element.userId === userObj.uid)[0].id}`), {
                userImage : attachmentUrl,
            });
            refreshUserObj();
        }

    }

    const onUpdateUserBackground = async() => {
        let backAttachmentUrl = "";

        const backAttachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const backResponse = await uploadString(backAttachmentRef, userBackgroundAttachment, "data_url" );
        backAttachmentUrl = await getDownloadURL(backResponse.ref);

        if(userBackgroundAttachment !== userObj.backgroundImg){
            await updateProfile(authService.currentUser, {backgroundImg: backAttachmentUrl});
            await updateDoc(doc(db, 'usersInfo', `${usersProfile.filter(element => element.userId === userObj.uid)[0].id}`), {
                backgroundImg : backAttachmentUrl,
            });
            refreshUserObj();
        }
        setChangedUserBackgroundAttachment(userBackgroundAttachment);
    }

    const handleUpdateProfile = () => {
        setModalOpen((prev) => !prev);
    }

    return(
        <>
            {myTweetList === null || usersProfile.length === 0 ? (
                <div className='container'>
                </div>
            ) : (
                <>
                    { modalOpen && <ModalUpdateProfile userAttachment={userAttachment} onUserAttachment={onUserAttachment} onUserBackgroundAttachment={onUserBackgroundAttachment} newDisplayName={newDisplayName} onChangeDisplayName={onChangeDisplayName} onChangeUserProfile={onChangeUserProfile} setModalOpen={setModalOpen} userBackgroundAttachment={userBackgroundAttachment} />}
                    <div className='container'>
                        <div className='background_container'>
                            {userBackgroundAttachment && (
                                <img src={changedUserBackgroundAttachment} />
                            )}
                        </div>

                        <div className='my_profile_container'>
                            <div className='my_profile_container_top'>
                                <img src={userObj.photoURL} />
                                <button onClick={handleUpdateProfile}>Set up profile</button>
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
                        {/* <div className='my_trace_navi'>    
                            <div className={currentNavi.Tweets ? "my_trace_box tweets tweets_active" : "my_trace_box tweets"} onClick={() => handleTraceClick('Tweets')}>
                                <span>Tweets</span>
                            </div>
                            <div className={currentNavi.TweetsReplies ? 'my_trace_box tweets_replies tweets_replies_active' : 'my_trace_box tweets_replies'} onClick={() => handleTraceClick('TweetsReplies')}>
                                <span>Tweets & replies</span>
                            </div>
                            <div className={currentNavi.Media ? 'my_trace_box media media_active' : 'my_trace_box media'} onClick={() => handleTraceClick('Media')}>
                                <span>Media</span>
                            </div>
                            <div className={currentNavi.Likes ? 'my_trace_box likes likes_active' : 'my_trace_box likes'} onClick={() => handleTraceClick('Likes')}>
                                <span>Likes</span>
                            </div>
                        </div>

                        {currentNavi.Tweets && <ProfileNaviTweets usersProfile={usersProfile} userObj={userObj} tictoc={myTweetList} setToastAlert={setToastAlert} setToastText={setToastText} setUsersProfile={setUsersProfile} currentPage={currentPage} setCurrentPage={setCurrentPage} setTweetDetail={setTweetDetail} />}
                        {currentNavi.TweetsReplies && <ProfileNaviTweets_Replies usersProfile={usersProfile} userObj={userObj} setUsersProfile={setUsersProfile} />}
                        {currentNavi.Media && <ProfileNaviMedia usersProfile={usersProfile} userObj={userObj} />}
                        {currentNavi.Likes && <ProfileNaviLikes userObj={userObj} tweets={tweets} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} />} */}
                    
                    </div>
                </>
            )}
        </>


    );
}

export default Profile;