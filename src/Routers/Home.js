import React, { useState, useEffect } from 'react';
import { db } from 'fbase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore"; 
import Tictoc from 'components/Tictoc';
import TwitFactory from 'components/TwitFactory';
import Retwit from 'components/Retwit';


const Home = ({ userObj }) => {
    const [messages, setMessages] = useState([]);
    const [retwitContent, setRetwitContent] = useState('');


    useEffect(() => {
        // db의 tictoc 컬렉션을 craetedAt이라는 요소 내림차순.
        // const q = query(collection(db, 'tictoc'), orderBy("createdAt", "desc"));

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
        console.log("q = " , q);

    }, []);

    // 부모 댓글이면 삭제하는것이 아니라 text를 deleted Text로 변경
    const deleteParent = async(id) => {

        await updateDoc(doc(db, "tictoc", id), {
            text : 'deleted Text',
            isDeleted : true,
        } );

    }
    console.log("retwitContent = ", retwitContent );

    return(
        <>
            <div className="container">
                {/* {retwitContent && <Retwit retwitContent={retwitContent} setRetwitContent={setRetwitContent} />} */}
                {retwitContent === null || retwitContent === "" ? (null) : (
                    <Retwit retwitContent={retwitContent} setRetwitContent={setRetwitContent} />
                ) }
                <TwitFactory userObj={userObj} retwitContent={retwitContent} setRetwitContent={setRetwitContent} />
                <div style={{ marginTop : 30 }}>
                    {messages.map((element) => {
                        return <Tictoc key={element.id} tictoc={element} isOwner={element.userId === userObj.uid} userObj={userObj} deleteParent={deleteParent} setRetwitContent={setRetwitContent} />
                    })}
                </div>
            </div>

        </>
    );
}

export default Home;