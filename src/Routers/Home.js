import React, { useState, useEffect } from 'react';
import { db } from 'fbase';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"; 
import Tictoc from 'components/Tictoc';
import TwitFactory from 'components/TwitFactory';


const Home = ({ userObj }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // db의 tictoc 컬렉션을 craetedAt이라는 요소 내림차순.
        const q = query(collection(db, 'tictoc'), orderBy("createdAt", "desc"));

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

    return(
        <>
            <div className="container">
                <TwitFactory userObj={userObj}/>
                <div style={{ marginTop : 30 }}>
                    {messages.map((element) => {
                        return <Tictoc key={element.id} tictoc={element} isOwner={element.userId === userObj.uid}/>
                    })}
                </div>
            </div>

        </>
    );
}

export default Home;