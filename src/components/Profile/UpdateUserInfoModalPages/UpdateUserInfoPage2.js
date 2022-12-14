import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faImage, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const UpdateUserInfoPage2 = ({ setCurrentPageIndex, userBackgroundAttachment, setBackgroundIconHover, onUserBackgroundAttachment, backgroundIconHover }) => {
    return(
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
    );
}

 export default UpdateUserInfoPage2