import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from 'Routers/Auth';
import Home from 'Routers/Home';
import Profile from 'Routers/Profile';
import Navigation from 'components/Navigation';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from 'fbase';
import TopNavi from 'Routers/TopNavi';
import SideRecommend from 'Routers/SideRecommend';
import Details from 'Routers/Details';


const AppRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(getAuth().currentUser);
    const [userObj, setUserObj] = useState(null);
    const [init, setInit] = useState(false);
    const [usersProfile, setUsersProfile] = useState([]);
    const [currentPage, setCurrentPage] = useState('home');
    const [reTweetState, setRetweetState] = useState(false);
    const [parentBundle, setParentBundle] = useState();
    const [tweetDetail, setTweetDetail] = useState();
    const [toastAlert, setToastAlert] = useState(false);
    const [toastText, setToastText] = useState('');

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user){
                setIsLoggedIn(true);
                setUserObj({
                    displayName : user.displayName,
                    uid : user.uid,
                    updateProfile: () => updateProfile(user, { displayName : user.displayName }),
                    photoURL : user.photoURL,
                    email : user.email,
                    pin : '',
                    follower : [],
                    following : [],
                });
                setInit(true);
            } else{
                setIsLoggedIn(false);
                setInit(true);
            }
        })

        
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
    
    }, []);

    const refreshUserObj = () => {
        setUserObj(getAuth().currentUser);
    }
    
    return(
        <>
            <Router>
                {init ? (
                    <>
                    {isLoggedIn && <TopNavi currentPage={currentPage} userObj={userObj}/>}
                    {isLoggedIn && <Navigation userObj={userObj} retweetState={reTweetState} parentBundle={parentBundle} setUserObj={setUserObj}/>}
                        <Routes>
                            {isLoggedIn ? (
                                <>
                                    <Route path='/' element={<Home userObj={userObj} setUserObj={setUserObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} currentPage={currentPage} setCurrentPage={setCurrentPage} reTweetState={reTweetState} setRetweetState={setRetweetState} parentBundle={parentBundle} setParentBundle={setParentBundle} setTweetDetail={setTweetDetail} toastAlert={toastAlert} setToastAlert={setToastAlert} toastText={toastText} setToastText={setToastText} />} />
                                    <Route path='/profile' element={<Profile refreshUserObj={refreshUserObj} userObj={userObj} usersProfile={usersProfile} setCurrentPage={setCurrentPage} setTweetDetail={setTweetDetail} setToastAlert={setToastAlert} setToastText={setToastText} setUsersProfile={setUsersProfile} />} />
                                    <Route path='/details' element={<Details tweetDetail={tweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} usersProfile={usersProfile} userObj={userObj} setToastAlert={setToastAlert} setToastText={setToastText} />} />
                                </>
                            ) : (
                                <Route path='/' element={<Auth userObj={userObj} setUserObj={setUserObj} usersProfile={usersProfile}  />} />
                            )}
                        </Routes>
                    {isLoggedIn && <SideRecommend usersProfile={usersProfile} userObj={userObj} setUsersProfile={setUsersProfile}/>}
                    </>
                ) : (
                    <span className='loading_page'>LOADING...</span>
                )}
            </Router>
        </>
    );
}

export default AppRouter;