import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const TopNavi = ({ currentPage, userObj }) => {
    const navigate = useNavigate();
    const handlePreviousPage = () => {
        navigate(-1);
    }
    return(
        <>
            {/* {currentPage === "home" ? (
                <div className="top_container">
                    <div className="show_current_page">
                        <span>HOME</span>
                    </div>
                </div>
            ) : (
                <div className="top_container">
                    <div className="show_current_page">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={handlePreviousPage} />
                        <span>{userObj.displayName}</span>
                    </div>
                </div>
            )} */}

            {currentPage === "home" &&
                <div className="top_container">
                    <div className="show_current_page">
                        <span>HOME</span>
                    </div>
                </div>
            }

            {currentPage === 'profile' && 
                <div className="top_container">
                    <div className="show_current_page">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={handlePreviousPage} />
                        <span>{userObj.displayName}</span>
                    </div>
                </div>        
            }

            {currentPage === 'details' &&
                <div className="top_container">
                    <div className="show_current_page">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={handlePreviousPage} />
                        <span>Tweet</span>
                    </div>
                </div>
            }
        </>
    )
}

export default TopNavi;