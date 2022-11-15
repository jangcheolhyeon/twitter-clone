import React, { useState, useEffect } from 'react';
import { db } from 'fbase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore"; 
import Tictoc from 'components/Tictoc';
import TweetFactory from 'components/TweetFactory';
import Retweet from 'components/Retweet';


const Home = ({ userObj }) => {
    const [messages, setMessages] = useState([]);
    const [RetweetContent, setRetweetContent] = useState('');
    const [reTweetState, setRetweetState] = useState(false);
    const [parentBundle, setParentBundle] = useState();


    useEffect(() => {
        // db의 tictoc 컬렉션을 craetedAt이라는 요소 내림차순.
        const q = query(collection(db, 'tictoc'), orderBy("bundle", "asc"), orderBy("createdAt", "asc"));
        // 위에 쿼리 끌고와서 변화가 감지되면 setMessage state에 넣어서 rerender해줌
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

    // 부모 댓글이면 삭제하는것이 아니라 text를 deleted Text로 변경
    const deleteParentTweet = async(id) => {
        await updateDoc(doc(db, "tictoc", id), {
            text : 'deleted Text',
            isDeleted : true,
        } );
    }

    return(
        <>
            <div className="container">
                {RetweetContent === null || RetweetContent === "" ? (null) : (
                    <Retweet RetweetContent={RetweetContent} setRetweetContent={setRetweetContent} />
                ) }
                <TweetFactory userObj={userObj} RetweetContent={RetweetContent} setRetweetContent={setRetweetContent} setRetweetState={setRetweetState} retweetState={reTweetState} parentBundle={parentBundle} />
                <div className='tictoc_container'>
                    {messages.map((element) => {
                        return <Tictoc key={element.id} tictoc={element} isOwner={element.userId === userObj.uid} userObj={userObj} deleteParentTweet={deleteParentTweet} setRetweetContent={setRetweetContent} setRetweetState={setRetweetState} setParentBundle={setParentBundle}/>
                    })}

                </div>
            </div>

        </>
    );
}

export default Home;