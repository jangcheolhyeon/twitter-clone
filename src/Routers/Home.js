import React, {useState} from 'react';
import { db } from 'fbase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

const Home = () => {
    const [message, setMessage] = useState('');

    const onChange = (e) => {
        setMessage(e.target.value)
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        try{
            const docRef = await addDoc(collection(db, 'tictoc'), {
                text : message,
                clock :  serverTimestamp(),
            });

            setMessage('');
        } catch(error){
            console.log(error);
        }
    }

    return(
        <>
            <h1>Home</h1>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder='whats your mind' value={message} onChange={onChange} />
                <button>submit</button>
            </form>
        </>
    );
}

export default Home;