import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faXmark, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const UpdateUserInfoPage1 = ({ setModalOpen, userAttachment, cameraHover, setCameraHover, onUserAttachment, setCurrentPageIndex }) => {
    return(
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
                {userAttachment ? (
                    <img src={userAttachment} alt="attachment" />
                ) : (
                    <FontAwesomeIcon icon={faCircleUser} />
                )}
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
    );
}

export default UpdateUserInfoPage1