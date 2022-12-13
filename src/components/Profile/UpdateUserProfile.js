import { authService, db, storageService } from "fbase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import ModalUpdateProfile from "components/Profile/ModalUpdateProfile";

const UpdateUserProfile = ({ userObj, usersProfile, setUsersProfile, userBackgroundAttachment, setUserBackgroundAttachment, setChangedUserBackgroundAttachment, newDisplayName, setNewDisplayName, refreshUserObj }) => {   
    const [modalOpen, setModalOpen] = useState(false);
    const [userAttachment, setUserAttachment] = useState(userObj.photoURL);

    let currentUser;

    useEffect(() => {
        if(userObj.photoURL !== '' || userObj.photoURL !== null){
            setUserAttachment(userObj.photoURL);
        }
        
        currentUser = usersProfile.filter(element => element.userId === userObj.uid)[0];
        setUserBackgroundAttachment(currentUser.backgroundImg);
        setChangedUserBackgroundAttachment(currentUser.backgroundImg);
    }, [])

    useEffect(() => {
        const newUsersProfile = usersProfile.map(element => {
            if(element.userId === userObj.uid){
                return {...element, displayName : userObj.displayName}
            } else{
                return element;
            }
        })
        setUsersProfile(newUsersProfile);
    }, [modalOpen])

    const handleUpdateProfile = () => {
        setModalOpen((prev) => !prev);
    }

    const onChangeDisplayName = (event) => {
        const {target : {value}} = event;
        setNewDisplayName(value);
    }

    const onUserAttachment = (e) => {
        const {target : { files }} = e;
        
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent;
            setUserAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onUserBackgroundAttachment = (e) => {
        const {target : {files}} = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent;
            setUserBackgroundAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }


    const onChangeUserProfile = async(event) => {
        event.preventDefault();
        onUpdateUserImg();
        onUpdateUserBackground();
        if(newDisplayName !== userObj.displayName){
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            const currentUserId = usersProfile.filter(element => element.userId === userObj.uid)[0];

            await updateDoc(doc(db, 'usersInfo', currentUserId.id), {
                displayName : userObj.displayName
            })
                        
            refreshUserObj();
        }
        setModalOpen((prev) => !prev);
    }

    const onUpdateUserImg = async() => {
        let attachmentUrl = "";

        const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const response = await uploadString(attachmentRef, userAttachment, "data_url" );
        attachmentUrl = await getDownloadURL(response.ref);

        if(userAttachment !== userObj.userImage){
            await updateProfile(authService.currentUser, {photoURL: attachmentUrl});
            await updateDoc(doc(db, 'usersInfo', `${usersProfile.filter(element => element.userId === userObj.uid)[0].id}`), {
                userImage : attachmentUrl,
            });
            refreshUserObj();
        }
    }


    const onUpdateUserBackground = async() => {
        let backAttachmentUrl = "";

        const backAttachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const backResponse = await uploadString(backAttachmentRef, userBackgroundAttachment, "data_url" );
        backAttachmentUrl = await getDownloadURL(backResponse.ref);

        if(userBackgroundAttachment !== userObj.backgroundImg){
            await updateProfile(authService.currentUser, {backgroundImg: backAttachmentUrl});
            await updateDoc(doc(db, 'usersInfo', `${usersProfile.filter(element => element.userId === userObj.uid)[0].id}`), {
                backgroundImg : backAttachmentUrl,
            });
            refreshUserObj();
        }
        setChangedUserBackgroundAttachment(userBackgroundAttachment);
    }
    
    return(
        <>
            { modalOpen && <ModalUpdateProfile userAttachment={userAttachment} onUserAttachment={onUserAttachment} onUserBackgroundAttachment={onUserBackgroundAttachment} newDisplayName={newDisplayName} onChangeDisplayName={onChangeDisplayName} onChangeUserProfile={onChangeUserProfile} setModalOpen={setModalOpen} userBackgroundAttachment={userBackgroundAttachment} />}
            <button onClick={handleUpdateProfile}>Set up profile</button>
        </>
    );
}

export default UpdateUserProfile;