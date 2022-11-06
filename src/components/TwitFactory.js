import React, {useState} from "react";
import { db, storageService } from 'fbase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { collection, addDoc, serverTimestamp, query, getDocs, orderBy, onSnapshot, doc } from "firebase/firestore"; 

const TwitFactory = ({ userObj }) => {
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState('');


    const onChange = (e) => {
        setMessage(e.target.value);
    }

    const onSubmit = async(e) => {
        e.preventDefault();

        let attachmentUrl = "";

        //파일을 업로드 하지 않았을때 
        if(attachment !== ""){
            // 저장할 경로(userObj.uid/랜덤값(v4))
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            // 위에 만든 경로로 업로드 하기
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            console.log("response REF, " + response.ref);
            console.log(await getDownloadURL(response.ref));
            // storage에 있는 파일 URL을 통해 이미지를 다운로드 하고 attchmentUrl에 넣음
            attachmentUrl = await getDownloadURL(response.ref);
        }

        // firebase에 올릴 정보들(글, 사진)
        const twitObj = {
            text : message,
            createdAt : Date.now(),
            userId : userObj.uid,
            attachmentUrl
        }

        // db에 tictoc이라는 컬렉션에 추가 twitObj 객체 추가
        await addDoc(collection(db, 'tictoc'), twitObj);

        setMessage('');
        setAttachment('');
    }

    const onFileChange = (e) => {
        const {target : { files }} = e;
        
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    
    const onClearImage = () => {
        setAttachment('');
    }

    return(
        <form onSubmit={onSubmit}>
            <input type="text" placeholder='whats your mind' value={message} onChange={onChange} />
            <input type="file" accept='image/*' onChange={onFileChange} />
            {attachment ? (
                <>
                    <img src={attachment} width="50px" height={'50px'} />
                    <button onClick={onClearImage}>clear</button>
                </>
            ) : null}

            <button style={{display:"block"}}>submit</button>
        </form>
    );
}

export default TwitFactory;