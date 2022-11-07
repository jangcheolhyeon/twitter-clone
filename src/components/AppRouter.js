import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from 'Routers/Auth';
import Home from 'Routers/Home';
import Profile from 'Routers/Profile';
import Navigation from 'components/Navigation';
import { authService } from 'fbase';

const AppRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(getAuth().currentUser);
    const [userObj, setUserObj] = useState(null);
    const [init, setInit] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        // init은 처음에 로딩할때 Loading을 해줌(안해주면 쿠키를 통해서 로그인 정보를 가져오기 전에 로그인안한상태의 로그인페이지가 뜸)
        onAuthStateChanged(auth, (user) => {
            if(user){
                setIsLoggedIn(true);
                setUserObj({
                    displayName : user.displayName,
                    uid : user.uid,
                    updateProfile: () => updateProfile(user, { displayName : user.displayName }),
                });
                setInit(true);
            } else{
                setIsLoggedIn(false);
                setInit(true);
            }
        })
    }, [])

    const refreshUserObj = () => {
        setUserObj(authService.currentUser);
    }

    // console.log('AppRouter의 userObj = ', userObj);

    return(
        <>
            {/* <Router>
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
            </Router> */}

            <Router>
                {init ? (
                    <>
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
                    </>
                ) : (
                    <span className='loading_page'>LOADING...</span>
                )}
            </Router>
        </>
    );
}

export default AppRouter;