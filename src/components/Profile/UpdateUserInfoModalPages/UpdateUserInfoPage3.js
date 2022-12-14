import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const UpdateUserInfoPage3 = ({ setCurrentPageIndex, newDisplayName, onChangeDisplayName, onChangeUserProfile }) => {
    return(
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
    );
}

export default UpdateUserInfoPage3