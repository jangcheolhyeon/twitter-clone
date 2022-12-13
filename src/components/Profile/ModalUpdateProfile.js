import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faLeftLong, faXmark, faImage } from "@fortawesome/free-solid-svg-icons";

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
                    <>
                        <div className="modal_update_display_name_top">
                            <FontAwesomeIcon icon={faXmark} onClick={() => {setModalOpen(false)}} />
                            <FontAwesomeIcon icon={faTwitter} />
                        </div>
                        
                        <div className="modal_update_content">
                            <span className="modal_upload_header">
                                Pick a profile picture
                            </span>
                            <span className="modal_upload_text">
                                Have a favorite selfie? Upload it now.
                            </span>
                        </div>

                        <div className="modal_update_user_img modal_update_container">
                            <img src={userAttachment} alt='attachment' />
                            <div className="modal_update_camera" 
                                onMouseOver={() => {setCameraHover(true)}}
                                onMouseOut={() => {setCameraHover(false)}}
                            >
                                <label htmlFor="attach-file">
                                    <FontAwesomeIcon icon={faCamera} />
                                </label>
                                <input type="file" id="attach-file" accept='image/*' onChange={onUserAttachment} className="modal_update_input_user_img" />

                                {cameraHover && 
                                    <div className="modal_update_img_hover">
                                        <span>add</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="modal_update_skip_btn">
                            <button onClick={() => { setCurrentPageIndex('page2') }}>Next</button>
                        </div>
                    </>
                )}

                {currentPageIndex === 'page2' && (
                    <>
                        <div className="modal_update_display_name_top">
                            <FontAwesomeIcon icon={faLeftLong} onClick={() => setCurrentPageIndex('page1')} />
                            <FontAwesomeIcon icon={faTwitter} />
                        </div>

                        <div className="modal_update_content">
                            <span className="modal_upload_header">
                                Update your background Image
                            </span>
                            <span className="modal_upload_text">
                                Have a favorite background Image? Upload it now.
                            </span>
                        </div>

                        <div className="update_background_img_container modal_update_container">
                            {userBackgroundAttachment && <img src={userBackgroundAttachment} alt='user background Image' />}
                            <div className="modal_update_background"
                                onMouseOver={() => {setBackgroundIconHover(true)}}
                                onMouseOut={() => {setBackgroundIconHover(false)}}
                            >
                                <label htmlFor="attach-file-user-background">
                                    <FontAwesomeIcon icon={faImage} />
                                </label>
                                <input type="file" id="attach-file-user-background" accept='image/*' onChange={onUserBackgroundAttachment} className="modal_update_input_user_img" />
                                
                                {backgroundIconHover && 
                                    <div className="modal_update_img_hover">
                                        <span>add</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="modal_update_skip_btn">
                            <button onClick={() => { setCurrentPageIndex('page3') }}>Next</button>
                        </div>
                    </>
                )}

                {currentPageIndex === 'page3' && (
                    <>
                        <div className="modal_update_display_name_top">
                            <FontAwesomeIcon icon={faLeftLong} onClick={() => setCurrentPageIndex('page2')} />
                            <FontAwesomeIcon icon={faTwitter} />
                        </div>
                        <div className="modal_update_content">
                            <span className="modal_upload_header">
                                Update your nickname
                            </span>
                            <span className="modal_upload_text">
                                Have a favorite name? Upload it now.
                            </span>
                        </div>
                        <div className="update_display_name_text">
                            <input type="text" placeholder="Display Name" value={newDisplayName} onChange={onChangeDisplayName} />
                        </div>
                        <div className="modal_update_skip_btn">
                            <button onClick={onChangeUserProfile}>SAVE</button>
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default ModalUpdateProfile;