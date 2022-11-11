import React from "react";
import Helmet from "react-helmet";

const metaCard = () => {
    return(
        <div className="card_container">
            <Helmet>
                <title>네이버</title>
                
                <meta name="description" content="NAVER" />
                <meta name="keywords" content="NAVER" />

                <meta property="og:type" content="website" />
                <meta property="og:title" content="NAVER" />
                <meta property="og:site_name" content="NAVER" />
                <meta property="og:description" content="NAVER PAGE" />
                <meta property="og:image" content="./image/image2.jpg" />
                <meta property="og:url" content="https://www.naver.com" />
            </Helmet>
            {/* 트위터는 뭐 승인 받아야 하는듯 */}
            {/* <meta property="twitter:card" content="summary" />
            <meta property="twitter:site" content="goddino" />
            <meta property="twitter:title" content="goddino Korea" />
            <meta property="twitter:description" content="품격있는 블로그" />
            <meta property="twitter:image" content="./image/image2.jpg" />
            <meta property="twitter:url" content="https://goddino.tistory.com" /> */}
        </div>
    );
}

export default metaCard;