import React, { useState, useEffect } from 'react';
import { db } from 'fbase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore"; 
import Tictoc from 'components/Tictoc';
import TweetFactory from 'components/TweetFactory';
import Retweet from 'components/Retweet';
// import ToastAlert from 'components/ToastAlert';


const Home = ({ userObj, usersProfile }) => {
    const [messages, setMessages] = useState([]);
    const [RetweetContent, setRetweetContent] = useState('');
    const [reTweetState, setRetweetState] = useState(false);
    const [parentBundle, setParentBundle] = useState();
    const [toastState, setToastState] = useState(false);


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

        
    }, []);

    const deleteParentTweet = async(id) => {
        await updateDoc(doc(db, "tictoc", id), {
            text : 'deleted Text',
            isDeleted : true,
        } );
    }

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
                            return <Tictoc key={element.id} tictoc={element} isOwner={element.userId === userObj.uid} userObj={userObj} deleteParentTweet={deleteParentTweet} setRetweetContent={setRetweetContent} setRetweetState={setRetweetState} setParentBundle={setParentBundle} usersProfile={usersProfile} setToastState={setToastState}/>
                        })}
                    </div>
                    {/* {toastState && 
                        <ToastAlert setToastState={setToastState} />
                    } */}
                </div>
            </div>
        </>
    );
}

export default Home;