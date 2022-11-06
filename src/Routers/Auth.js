import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from 'react';

const Auth = () => {
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

    const onSnsClick = async (event) => {
        const {target : { name }} = event;

        const auth = getAuth();
        let provider;

        // OAUTH 인증
        if(name === 'google'){
            provider = new GoogleAuthProvider();
        } else if(name === 'github'){
            provider = new GithubAuthProvider();
        }
        await signInWithPopup(auth, provider);
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder='Email' name="email" required value={email} onChange={onChange} />
                <input type="password" placeholder='Password' name="password" required value={password} onChange={onChange} />
                <input type="submit" value={createNewAccount ? 'create' : 'login'} />
            </form>            
            <div>
                <button onClick={onSnsClick} name="google">Continue with Google</button>
                <button onClick={onSnsClick} name="github">Continue with Github</button>
                <button onClick={onToggleSign}>{createNewAccount ? 'sign in' : 'sign up'}</button>
            </div>
        </div>
    );
}

export default Auth;