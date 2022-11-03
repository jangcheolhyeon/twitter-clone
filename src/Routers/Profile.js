import { getAuth, signOut } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const auth = getAuth();
    const navi = useNavigate();
    const onLogout = () => {
        signOut(auth);
        navi('/');
    }
    return(
        <>
            <h1>Profile</h1>
            <button onClick={onLogout}>logout</button>
        </>
    );
}

export default Profile;