import React, { useState, useEffect } from 'react';
import { db } from 'fbase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore"; 
import Tictoc from 'components/Tictoc';
import TweetFactory from 'components/TweetFactory';
import LikeToastNotification from 'components/LikeToastNotification';

const Home = ({ userObj, usersProfile, setCurrentPage }) => {
    const [messages, setMessages] = useState([]);
    const [RetweetContent, setRetweetContent] = useState('');
    const [reTweetState, setRetweetState] = useState(false);
    const [parentBundle, setParentBundle] = useState();
    const [likeToast, setLikeToast] = useState(false);

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
                    {/* {RetweetContent === null || RetweetContent === "" ? (null) : (
                        <Retweet RetweetContent={RetweetContent} setRetweetContent={setRetweetContent} userObj={userObj} />
                    ) } */}
                    <div className="write_tweet_container">
                        <TweetFactory userObj={userObj} RetweetContent={RetweetContent} setRetweetContent={setRetweetContent} setRetweetState={setRetweetState} retweetState={reTweetState} parentBundle={parentBundle} />
                    </div>

                    <div className='tictoc_container'>
                        {messages.map((element) => {
                            return <Tictoc key={element.id} tictoc={element} isOwner={element.userId === userObj.uid} userObj={userObj} setRetweetContent={setRetweetContent} setRetweetState={setRetweetState} setParentBundle={setParentBundle} usersProfile={usersProfile} setLikeToast={setLikeToast}/>
                        })}
                    </div>

                    { likeToast &&
                        <LikeToastNotification setLikeToast={setLikeToast}/>
                    }
                </div>
            </div>
        </>
    );
}

export default Home;