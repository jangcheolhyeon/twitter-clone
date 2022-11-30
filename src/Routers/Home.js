import React, { useState, useEffect } from 'react';
import { db } from 'fbase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore"; 
import Tweet from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';
import ToastNotification from 'components/ToastNotification';

const Home = ({ userObj, usersProfile, currentPage, setCurrentPage, reTweetState, setRetweetState, parentBundle, setTweetDetail, toastAlert, setToastAlert, toastText, setToastText, }) => {
    const [messages, setMessages] = useState([]);

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
        })

        setCurrentPage("home");

    }, []);

    return(
        <>
            <div className="container">
                <div className="content_container">
                    <div className="write_tweet_container">
                        <TweetFactory userObj={userObj} setRetweetState={setRetweetState} retweetState={reTweetState} parentBundle={parentBundle} />
                    </div>

                    <div className='tictoc_container'>
                        {messages.map((element) => {
                            return <Tweet key={element.id} tictoc={element} isOwner={element.userId === userObj.uid} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage}  />
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