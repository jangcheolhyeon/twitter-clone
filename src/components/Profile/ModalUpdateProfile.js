import React, { useEffect, useState } from "react";
import UpdateUserInfoPage1 from "components/Profile/UpdateUserInfoModalPages/UpdateUserInfoPage1";
import UpdateUserInfoPage2 from "components/Profile/UpdateUserInfoModalPages/UpdateUserInfoPage2";
import UpdateUserInfoPage3 from "components/Profile/UpdateUserInfoModalPages/UpdateUserInfoPage3";

const ModalUpdateProfile = ({ userAttachment, onUserAttachment, onUserBackgroundAttachment, newDisplayName, onChangeDisplayName, onChangeUserProfile, setModalOpen, userBackgroundAttachment, }) => {
    const [cameraHover, setCameraHover] = useState(false);
    const [backgroundIconHover, setBackgroundIconHover] = useState(false);
    const pageIndex = ['page1', 'page2', 'page3'];
    const [currentPageIndex, setCurrentPageIndex] = useState(pageIndex[0]);


    useEffect(() => {
        document.body.style.overflow = "hidden";

        return() => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    return(
        <div className="modal_update_profile_background">
            <div className="modal_update_profile_container">
                {currentPageIndex === 'page1' && (
                    <UpdateUserInfoPage1 
                        setModalOpen={setModalOpen}
                        userAttachment={userAttachment}
                        cameraHover={cameraHover}
                        setCameraHover={setCameraHover}
                        onUserAttachment={onUserAttachment}
                        setCurrentPageIndex={setCurrentPageIndex}
                    />
                )}

                {currentPageIndex === 'page2' && (
                    <UpdateUserInfoPage2 
                        setCurrentPageIndex={setCurrentPageIndex}
                        userBackgroundAttachment={userBackgroundAttachment}
                        setBackgroundIconHover={setBackgroundIconHover}
                        onUserBackgroundAttachment={onUserBackgroundAttachment}
                        backgroundIconHover={backgroundIconHover}
                    />
                )}

                {currentPageIndex === 'page3' && (
                    <UpdateUserInfoPage3 
                        setCurrentPageIndex={setCurrentPageIndex}
                        newDisplayName={newDisplayName}
                        onChangeDisplayName={onChangeDisplayName}
                        onChangeUserProfile={onChangeUserProfile}
                    />
                )}

            </div>
        </div>
    )
}

export default ModalUpdateProfile;