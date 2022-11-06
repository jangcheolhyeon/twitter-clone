import { getAuth, onAuthStateChanged, updateCurrentUser, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from 'Routers/Auth';
import Home from 'Routers/Home';
import Profile from 'Routers/Profile';
import Navigation from 'components/Navigation';
import { authService } from 'fbase';

const AppRouter = () => {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(getAuth().currentUser);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user){
                setIsLoggedIn(true);
                setUserObj({
                    displayName : user.displayName,
                    uid : user.uid,
                    updateProfile: () => updateProfile(user, { displayName : user.displayName }),
                });
            } else{
                setIsLoggedIn(false);
            }
            setInit(true);
        })
    }, [])

    const refreshUserObj = () => {
        setUserObj(authService.currentUser);
    }

    console.log('AppRouter의 userObj = ', userObj);

    return(
        <>
            <Router>
                {isLoggedIn && <Navigation userObj={userObj}/>}
                <Routes>
                    {isLoggedIn ? (
                        <>
                            <Route path='/' element={<Home userObj={userObj}/>} />
                            <Route path='/profile' element={<Profile refreshUserObj={refreshUserObj} userObj={userObj} />} />
                        </>
                    ) : (
                        <Route path='/' element={<Auth />} />
                    )}
                </Routes>
            </Router>
        </>
    );
}

export default AppRouter;