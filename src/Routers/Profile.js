import { getAuth, signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { authService, db } from 'fbase';


const Profile = ({ userObj, refreshUserObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const auth = getAuth();
    const navi = useNavigate();
    const onLogout = () => {
        signOut(auth);
        navi('/');
    }

    const getMyTwits = async () => {
        // db에 컬렉션이 tictoc에 userId가 userObj.uid와 일치하면 createdAt 내림차순으로 쿼리 가져오기
        const q = query(
            collection(db, "tictoc"),
            where("userId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );
        
        // getDocs()메서드로 쿼리 결과 값 가져오기
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " = " , doc.data());
        });
    };

    const onDisplayNameClick = async() => {
        //다르면 업데이트
        if(newDisplayName !== userObj.displayName){
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            refreshUserObj();
        }
    }

    const onChangeDisplayName = (event) => {
        const {target : {value}} = event;
        setNewDisplayName(value);
    }
        
    useEffect(() => {
        getMyTwits();
        localLoginProfile();
    }, []);

    // OAuth대신 로그인 하면 displayName이 안나옴. 그래서 email의 @기준으로 앞 부분을 displayNAme으로 설정
    function localLoginProfile(){   
        if(userObj.displayName === null){
            userObj.displayName = userObj.email.split('@')[0];
        }
    }

    return(
        <>

            <h1>Profile</h1>
            <div>
                <input type="text" placeholder="Display Name" value={newDisplayName} onChange={onChangeDisplayName} />
                <input type="button" value="Update profile" onClick={onDisplayNameClick}/>
            </div>
            <button onClick={onLogout}>logout</button>
        </>
    );
}

export default Profile;