import React, { useEffect, } from 'react';
import { db } from 'fbase';
import { collection, addDoc } from "firebase/firestore"; 
import Tweet from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';

const Home = ({ messages, userObj, usersProfile, setUsersProfile, currentPage, setCurrentPage, reTweetState, setRetweetState, parentBundle, setTweetDetail, toastAlert, setToastAlert, toastText, setToastText, updateCountNumber, setProfileLoading }) => {

    useEffect(() => {
        window.scrollTo({top:0, behavior:'smooth'});
        setCurrentPage("home");
    }, [])

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
                backgroundImg : null,
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
            backgroundImg : null,
        })
    }

    return(
        <>
        {usersProfile.length === 0 ? (
            <div className='container'>
            </div>
        ) : (
            <>
                <div className="container">
                    <div className="content_container">
                        <div className="write_tweet_container">
                            <TweetFactory userObj={userObj} setRetweetState={setRetweetState} retweetState={reTweetState} parentBundle={parentBundle} updateCountNumber={updateCountNumber} />
                        </div>

                        <div className='tictoc_container'>
                            {messages.map((element) => {
                                return <Tweet key={element.id} tictoc={element} isOwner={element.userId === userObj.uid} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} setUsersProfile={setUsersProfile} updateCountNumber={updateCountNumber} />
                            })}
                        </div>
                    </div>
                </div>
            </>
        )}
        </>
    );
}

export default Home;