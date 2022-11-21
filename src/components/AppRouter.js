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
    const [RetweetContent, setRetweetContent] = useState('');
    const [reTweetState, setRetweetState] = useState(false);
    const [parentBundle, setParentBundle] = useState();


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
                    photoURL : user.photoURL,
                    email : user.email,
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

    //db에 있는 데이터 refresh해서 state변동
    const refreshUserObj = () => {
        setUserObj(getAuth().currentUser);
    }

    return(
        <>
            <Router>
                {init ? (
                    <>
                    {isLoggedIn && <TopNavi currentPage={currentPage} userObj={userObj}/>}
                    {isLoggedIn && <Navigation userObj={userObj} retweetState={reTweetState} parentBundle={parentBundle} RetweetContent={RetweetContent} setRetweetContent={setRetweetContent}/>}
                        <Routes>
                            {isLoggedIn ? (
                                <>
                                    <Route path='/' element={<Home userObj={userObj} usersProfile={usersProfile} setCurrentPage={setCurrentPage} RetweetContent={RetweetContent} setRetweetContent={setRetweetContent} reTweetState={reTweetState} setRetweetState={setRetweetState} parentBundle={parentBundle} setParentBundle={setParentBundle} />} />
                                    <Route path='/profile' element={<Profile refreshUserObj={refreshUserObj} userObj={userObj} usersProfile={usersProfile} setCurrentPage={setCurrentPage}/>} />
                                    {/* <Route path='/details' element={<Details />} /> */}
                                </>
                            ) : (
                                <Route path='/' element={<Auth userObj={userObj} usersProfile={usersProfile}  />} />
                            )}
                        </Routes>
                    {isLoggedIn && <SideRecommend usersProfile={usersProfile} userObj={userObj} />}
                    </>
                ) : (
                    <span className='loading_page'>LOADING...</span>
                )}
            </Router>
        </>
    );
}

export default AppRouter;