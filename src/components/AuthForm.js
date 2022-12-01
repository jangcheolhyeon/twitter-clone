import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


const AuthForm = ({ userObj, usersProfile }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [createNewAccount, setCreateNewAccount] = useState(false);
    const [createEmail, setCreateEmail] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [createAccountModal, setCreateAccountModal] = useState(false);


    const onChange = (e) => {
        const {target : {value, name}} = e;

        if(name === 'email') setEmail(value)
        else if(name === 'password') setPassword(value);
        else if(name === 'createEmail') setCreateEmail(value);
        else if(name === 'createPassword') setCreatePassword(value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try{
            const auth = getAuth();
            if(createNewAccount){
                await createUserWithEmailAndPassword(auth, createEmail, createPassword);
                console.log("createNewAccount");
                await addDoc(collection(db, 'usersInfo'), {
                    userId : userObj.uid,
                    userImage : userObj.photoURL,
                    displayName : userObj.displayName,
                    email : userObj.email,
                    pin : '',
                    follower:[],
                    following:[],
                })

                onCraeteAccountModal();
                setCreateEmail('');
                setCreatePassword('');
                onToggleSign()

            } else {
                await signInWithEmailAndPassword(auth, email, password);       
                const isUserIn = usersProfile.filter(element => element.userId === userObj.uid).length;
                console.log("else createNewAccount");
                if(isUserIn === 0){
                    await addDoc(collection(db, 'usersInfo'), {
                        userId : userObj.uid,
                        userImage : userObj.photoURL,
                        displayName : userObj.displayName,
                        email : userObj.email,
                        pin : userObj.pin,
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

    const onCraeteAccountModal = () => {
        onToggleSign();
        setCreateAccountModal((prev) => {
            return !prev;
        })
    }

    return(
        <>
            <form onSubmit={onSubmit} className='login_form_container'>
                <input type="text" placeholder='Email' name="email" required value={email} onChange={onChange} className='authInput' />
                <input type="password" placeholder='Password' name="password" required value={password} onChange={onChange} className='authInput' />
                <input type="submit" value="login" className="authSubmit" />
            </form>
            <input type="button" value="sign up" className="authSwitch" onClick={onCraeteAccountModal}/>

            {createAccountModal && (
                <>
                    <div className="create_modal_background">
                        <div className="create_modal_container">
                            <div className="create_account_modal_close">
                                <FontAwesomeIcon icon={faXmark} onClick={onCraeteAccountModal}/>
                            </div>
                            <div className="twitter_icon_container">
                                <FontAwesomeIcon icon={faTwitter} />
                            </div>
                            <div className="create_account_form">
                                <input type="text" placeholder='Email' name="createEmail" required value={createEmail} onChange={onChange} className='create_authInput' />
                                <input type="password" placeholder='Password' name="createPassword" required value={createPassword} onChange={onChange} className='create_authInput' />
                                <input type="button" value='Create Account' className="create_account_btn" onClick={onSubmit}/>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );

}

export default AuthForm;