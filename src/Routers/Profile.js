import { getAuth, signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from "firebase/firestore";
import { authService, db, storageService } from 'fbase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


const Profile = ({ userObj, refreshUserObj, usersProfile }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [userAttachment, setUserAttachment] = useState(userObj.photoURL);
    const auth = getAuth();
    const navi = useNavigate();

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


    return(
        <div className='container'>
            <div className="profile_image">
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
            <button onClick={onLogout} className='formBtn cancelBtn logOut'>logout</button>
        </div>
    );
}

export default Profile;