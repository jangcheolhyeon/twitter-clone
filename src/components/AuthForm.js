import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "fbase";

const AuthForm = ({ userObj, usersProfile }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [createNewAccount, setCreateNewAccount] = useState(true);

    const onChange = (e) => {
        const {target : {value, name}} = e;

        if(name === 'email') setEmail(value)
        else if(name === 'password') setPassword(value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try{
            const auth = getAuth();
            if(createNewAccount){
                await createUserWithEmailAndPassword(auth, email, password);

                if(usersProfile.filter(element => element.userId === userObj.uid).length){
                    await addDoc(collection(db, 'usersInfo'), {
                        userId : userObj.uid,
                        userImage : userObj.photoURL,
                        displayName : userObj.displayName,
                        email : userObj.email,
                        follower:[],
                        following:[],
                    })
                }

            } else {
                await signInWithEmailAndPassword(auth, email, password);

                if(usersProfile.filter(element => element.userId === userObj.uid).length){
                    await addDoc(collection(db, 'usersInfo'), {
                        userId : userObj.uid,
                        userImage : userObj.photoURL,
                        displayName : userObj.displayName,
                        email : userObj.email,
                        follower:[],
                        following:[],
                    })
                }

            }

        } catch(error){
            console.log(error);
        }
    }

    const onToggleSign = () => {
        setCreateNewAccount((prev) => !prev);
    }

    return(
        <>
            <form onSubmit={onSubmit} className='container'>
                <input type="text" placeholder='Email' name="email" required value={email} onChange={onChange} className='authInput' />
                <input type="password" placeholder='Password' name="password" required value={password} onChange={onChange} className='authInput' />
                <input type="submit" value={createNewAccount ? 'create' : 'login'} className='authInput authSubmit' />
            </form>
            <span onClick={onToggleSign} className='authSwitch' >{createNewAccount ? 'sign in' : 'sign up'}</span>  
        </>
    );
}

export default AuthForm;