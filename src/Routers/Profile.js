import { updateProfile } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs, query, where, orderBy, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { authService, db, storageService } from 'fbase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import ProfileNaviTweets from './ProfileNaviTweets';
import ProfileNaviTweets_Replies from './ProfileNaviTweets_Replies';
import ProfileNaviMedia from './ProfileNaviMedia';
import ProfileNaviLikes from './ProfileNaviLikes';
import ModalUpdateProfile from 'components/ModalUpdateProfile';


const Profile = ({ userObj, refreshUserObj, usersProfile, setCurrentPage, setToastAlert, setToastText, setUsersProfile }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [userAttachment, setUserAttachment] = useState(userObj.photoURL);
    const [modalOpen, setModalOpen] = useState(false);
    const [myTweetList, setMyTweetList] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [currentNavi, setCurrentNavi] = useState({
        Tweets : true,
        TweetsReplies : false,
        Media : false,
        Likes : false
    });
    let currentUser;
    const [followersCnt, setFollowersCnt] = useState(0);
    const [followingCnt, setFollowingCnt] = useState(0);

    const getMyTweets = () => {    
        const q = query(collection(db, "tictoc"), orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
            const comments = snapshot.docs.map((doc) => {
                return {
                    id : doc.id,
                    ...doc.data(),
                }
            })

            setMyTweetList(comments.filter((element) => {
                return element.userId === userObj.uid;
            }));

            setTweets(comments);
        })
    };

    const onDisplayNameClick = async (event) => {
        event.preventDefault();
        onUpdateUserImg();
        if(newDisplayName !== userObj.displayName){
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            refreshUserObj();
        }
        setModalOpen((prev) => !prev);
    }

    const onChangeDisplayName = (event) => {
        const {target : {value}} = event;
        setNewDisplayName(value);
    }
        
    useEffect(() => {
        getMyTweets();
        createAccountUser();

        if(userObj.photoURL !== '' || userObj.photoURL !== null){
            setUserAttachment(userObj.photoURL);
        }

        setCurrentPage('profile');
    }, []);

    useEffect(() => {
        if(usersProfile.length !== 0){
            currentUser = usersProfile.filter(element => element.userId === userObj.uid)[0];

            setFollowersCnt(currentUser.follower.length);
            setFollowingCnt(currentUser.following.length);
        }
    }, [])

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

    const handleTraceClick = (key) => {        
        let newCurrentNavi = {
            Tweets : false,
            TweetsReplies : false,
            Media : false,
            Likes : false
        };

        switch(key){
            case 'Tweets' :
                newCurrentNavi.Tweets = true
                break;
            case 'TweetsReplies' :
                newCurrentNavi.TweetsReplies = true
                break;
            case 'Media' :
                newCurrentNavi.Media = true
                break;
            case 'Likes' :
                newCurrentNavi.Likes = true
                break;
        }
        setCurrentNavi(newCurrentNavi);
    }

    const handleUpdateProfile = () => {
        setModalOpen((prev) => !prev);
    }

    if (!myTweetList) {
        return null
    }

    return(
        <>
            { modalOpen && <ModalUpdateProfile userAttachment={userAttachment} onUserAttachment={onUserAttachment} newDisplayName={newDisplayName} onChangeDisplayName={onChangeDisplayName} onDisplayNameClick={onDisplayNameClick} setModalOpen={setModalOpen} /> }
            <div className='container'>
                <div className='background_container'>
                </div>

                <div className='my_profile_container'>
                    <div className='my_profile_container_top'>
                        <img src={userAttachment} />
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
                
                <div className='my_trace_navi'>
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

                {currentNavi.Tweets && <ProfileNaviTweets usersProfile={usersProfile} userObj={userObj} tictoc={myTweetList} setToastAlert={setToastAlert} setToastText={setToastText} setUsersProfile={setUsersProfile}/>}
                {currentNavi.TweetsReplies && <ProfileNaviTweets_Replies usersProfile={usersProfile} userObj={userObj} setUsersProfile={setUsersProfile} />}
                {currentNavi.Media && <ProfileNaviMedia usersProfile={usersProfile} userObj={userObj} />}
                {currentNavi.Likes && <ProfileNaviLikes userObj={userObj} tweets={tweets} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} />}
            </div>
        </>
    );
}

export default Profile;