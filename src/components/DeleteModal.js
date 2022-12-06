import React, { useEffect } from "react";

const DeleteModal = ({ onDeleteTweet, onDeleteModalCancel }) => {

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = 'auto';
        }
      }, []);


    return(
        <> 
            <div className="delete_modal_background_container">
                <div className="delete_modal_container">
                    <div className="delete_text_content">
                        <h2>Delete Tweet?</h2>
                        <span>This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results.</span>
                    </div>
                    <div className="delete_button_container">
                        <button className="delete" onClick={onDeleteTweet} >DELETE</button>
                        <button className="cancel" onClick={onDeleteModalCancel} >CANCEL</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteModal;