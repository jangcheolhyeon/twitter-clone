import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"; 

const TopNavi = () => {
    return(
        <>
            <div className="top_container">
                <div className="show_current_page">
                    <span>HOME</span>
                </div>
            </div>
            <div className="top_side_container">
                <div className="search_container">
                    <FontAwesomeIcon icon={faMagnifyingGlass} size={25} />
                    <input type="text" />
                </div>
            </div>
        </>
    )
}

export default TopNavi;