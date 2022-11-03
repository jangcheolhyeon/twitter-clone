import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from 'Routers/Auth';
import Home from 'Routers/Home';
import Profile from 'Routers/Profile';
import Navigation from 'components/Navigation';

const AppRouter = () => {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(getAuth().currentUser);

    useEffect(() => {
        console.log(isLoggedIn);
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user){
                setIsLoggedIn(true);
            } else{
                setIsLoggedIn(false);
            }
            setInit(true);
        })
    }, [])

    return(
        <>
            <Router>
                {isLoggedIn && <Navigation />}
                <Routes>
                    {isLoggedIn ? (
                        <>
                            <Route path='/' element={<Home />} />
                            <Route path='/profile' element={<Profile />} />
                        </>
                    ) : (
                        <Route path='/' element={<Auth />} ></Route>
                    )}
                </Routes>
            </Router>
        </>
    );
}

export default AppRouter;