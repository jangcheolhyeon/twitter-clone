import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faLeftLong, faXmark } from "@fortawesome/free-solid-svg-icons";

const ModalUpdateProfile = ({ userAttachment, onUserAttachment, newDisplayName, onChangeDisplayName, onDisplayNameClick, setModalOpen }) => {
    const [cameraHover, setCameraHover] = useState(false);
    const [nextPage, setNextPage] = useState(false);

    return(
        <div className="modal_update_profile_background">
            <div className="modal_update_profile_container">
                {nextPage ? (
                    <>
                        <div className="modal_update_display_name_top">
                            <FontAwesomeIcon icon={faLeftLong} onClick={() => setModalOpen(false)} />
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
                            <button onClick={onDisplayNameClick}>SAVE</button>
                        </div>
                    </>
                ) : (
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
                            
                            <div className="modal_update_skip_btn">
                            <button onClick={() => {setNextPage(true)}}>Next</button>
                        </div>
                        </div>
                        <div className="modal_update_user_img">
                            <img src={userAttachment} />
                            <div className="modal_update_camera">
                                <label htmlFor="attach-file">
                                    <FontAwesomeIcon icon={faCamera} 
                                        onMouseOver={() => {setCameraHover(true)}}
                                        onMouseOut={() => {setCameraHover(false)}}
                                    />
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
                            <button onClick={() => {setNextPage(true)}}>Next</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ModalUpdateProfile;