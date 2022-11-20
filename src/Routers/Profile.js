import { getAuth, signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from "firebase/firestore";
import { authService, db, storageService } from 'fbase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import RecommendFriend from 'components/RecommendFriend';
import ProfileNaviTweets from './ProfileNaviTweets';
import ProfileNaviTweets_Replies from './ProfileNaviTweets_Replies';
import ProfileNaviMedia from './ProfileNaviMedia';
import ProfileNaviLikes from './ProfileNaviLikes';


const Profile = ({ userObj, refreshUserObj, usersProfile }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [userAttachment, setUserAttachment] = useState(userObj.photoURL);
    // const [tweetsActive, setTweetsActive] = useState(true);
    // const [twwetsRepliesActive, setTweetsRepliesActive] = useState(false);
    // const [media, setMedia] = useState(false);
    // const [likes, setLikes] = useState(false);
    const [currentNavi, setCurrentNavi] = useState({
        Tweets : true,
        TweetsReplies : false,
        Media : false,
        Likes : false
    });

    const auth = getAuth();
    const navi = useNavigate();

    console.log("userObj", userObj);
    console.log("usersProfile", usersProfile);

    const onLogout = () => {
        signOut(auth);
        navi('/');
    }

    const getMyTweets = async () => {
        // db에 컬렉션이 tictoc에 userId가 userObj.uid와 일치하면 createdAt 내림차순으로 쿼리 가져오기
        const q = query(
            collection(db, "tictoc"),
            where("userId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );
        
        // getDocs()메서드로 쿼리 결과 값 가져오기
        await getDocs(q);

    };

    const onDisplayNameClick = async(event) => {
        event.preventDefault();
        //다르면 업데이트
        onUpdateUserImg();
        if(newDisplayName !== userObj.displayName){
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            refreshUserObj();
        }
    }

    const onChangeDisplayName = (event) => {
        const {target : {value}} = event;
        setNewDisplayName(value);
    }

        
    // React Hook useEffect has missing dependencies 경고는 useEffect 안에 state를 넣어줘야 되는데 그냥 쓰고싶을땐 ??
    useEffect(() => {
        getMyTweets();
        createAccountUser();

        if(userObj.photoURL !== '' || userObj.photoURL !== null){
            setUserAttachment(userObj.photoURL);
        }

    }, []);

    // OAuth대신 로그인 하면 displayName이 안나옴. 그래서 email의 @기준으로 앞 부분을 displayNAme으로 설정
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


    return(
        <div className='container'>
            <div className='background_container'>
            </div>

            <div className='my_profile_container'>
                <div className='my_profile_container_top'>
                    <img src={userAttachment} />
                    <button>Set up profile</button>
                </div>
            </div>

            <div className='my_profile_info_container'>
                <span className='user_name'>{userObj.displayName}</span>
                <span className='user_email'>{userObj.email}</span>
                <div className='follow_follower_info'>
                    <span>
                        <span className='number'>0</span> Following
                    </span>
                    <span>
                        <span className='number'>0</span> Followers
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

            {currentNavi.Tweets && <ProfileNaviTweets usersProfile={usersProfile} userObj={userObj} />}
            {currentNavi.TweetsReplies && <ProfileNaviTweets_Replies usersProfile={usersProfile} userObj={userObj} />}
            {currentNavi.Media && <ProfileNaviMedia usersProfile={usersProfile} userObj={userObj} />}
            {currentNavi.Likes && <ProfileNaviLikes usersProfile={usersProfile} userObj={userObj} />}

            {/* <div className='my_trace_content'>
                <div className='my_trace_content_top'>
                    <span>Let's get you set up</span>
                    <FontAwesomeIcon icon={faEllipsis} className='three-dots-icon' />
                </div>
                <div className='setup_container'>
                    <div className="setup_box complete_your_profile">

                    </div>
                    <div className="setup_box follow_5_account">

                    </div>
                    <div className="setup_box follow_3Topics">

                    </div>
                    <div className="setup_box">

                    </div>
                </div>
            </div> */}
            {/* <div className='profile_follow_recommend'>
                <span>Who to follow</span>
                
                <div className="recommend_list_container">
                    <ul className="recommend_list">
                        {usersProfile.filter(element => element.userId !== userObj.uid).map((element) => {
                            return(
                                <>
                                    <RecommendFriend
                                        key={element.userId} user={element} 
                                    />
                                    <span>asdlfnsaldk</span>
                                </>
                            );
                        })}
                    </ul>
                </div>
            </div> */}

            {/* <div className="profile_image">
                <img src={userAttachment} />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photo</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input type="file" id="attach-file" accept='image/*' className='update_btn file_upload_input' onChange={onUserAttachment} />

            <form onSubmit={onDisplayNameClick} className='profileForm' >
                <input type="text" placeholder="Display Name" value={newDisplayName} onChange={onChangeDisplayName} className='formInput' />
                <button className='formBtn'>update profile</button>
            </form>
            <button onClick={onLogout} className='formBtn cancelBtn logOut'>logout</button> */}
        </div>
    );
}

export default Profile;