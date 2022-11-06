import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const inputStyles = {};

const AUthForm = () => {
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
            // 로그인했는지 정보 가져오기
            const auth = getAuth();
            if(createNewAccount){
                // createNewAccount
                const data = await createUserWithEmailAndPassword(auth, email, password);
                console.log(data);
            } else {
                // login
                const data = await signInWithEmailAndPassword(auth, email, password);
                console.log(data);
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

export default AUthForm;