import React, { useState, useEffect, useRef } from 'react';
import { db } from 'fbase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, where, addDoc } from "firebase/firestore"; 
import Tweet from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';
import ToastNotification from 'components/ToastNotification';

const Home = ({ userObj, usersProfile, setUsersProfile, currentPage, setCurrentPage, reTweetState, setRetweetState, parentBundle, setTweetDetail, toastAlert, setToastAlert, toastText, setToastText }) => {
    const [messages, setMessages] = useState([]);
    const [defaultMessages, setDefaultMessages] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'tictoc'), orderBy("bundle", "asc"), orderBy("createdAt", "asc"));
        onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map((doc) => {
                return {
                    id : doc.id,
                    ...doc.data(),
                }
            })
            setMessages(newMessages);
            setDefaultMessages(newMessages);
        })


        setCurrentPage("home");
    }, []);

    useEffect(() => {
        let currentUser = usersProfile.filter(element => element.userId === userObj.uid)[0];
        if(!currentUser && usersProfile.length !== 0){
            insertUser();
            let newUsersProfile = [...usersProfile, {
                userId : userObj.uid,
                userImage : userObj.photoURL,
                displayName : userObj.displayName,
                email : userObj.email,
                pin : '',
                follower:[],
                following:[],
            }];
            setUsersProfile(newUsersProfile);
        }

    }, [userObj])

    const insertUser = async() => {
        await addDoc(collection(db, 'usersInfo'), {
            userId : userObj.uid,
            userImage : userObj.photoURL,
            displayName : userObj.displayName,
            email : userObj.email,
            pin : '',
            follower:[],
            following:[],
        })
    }

    if(usersProfile.length === 0) return;

    return(
        <>
            <div className="container">
                <div className="content_container">
                    <div className="write_tweet_container">
                        <TweetFactory userObj={userObj} setRetweetState={setRetweetState} retweetState={reTweetState} parentBundle={parentBundle} />
                    </div>

                    <div className='tictoc_container'>
                        {messages.map((element) => {
                            return <Tweet key={element.id} tictoc={element} isOwner={element.userId === userObj.uid} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} setUsersProfile={setUsersProfile} />
                        })}
                    </div>

                    {toastAlert &&
                        <ToastNotification text={toastText} setToastAlert={setToastAlert}/>
                    }
                </div>
            </div>
        </>
    );
}

export default Home;