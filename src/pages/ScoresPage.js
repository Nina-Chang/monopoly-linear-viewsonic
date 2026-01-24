import React from 'react'

const ScoresPage = ({navigateTo, backgroundImage}) => {
    const pageStyle = { 
        backgroundImage: `url(${backgroundImage})`,
        width:'1920px',
        height:'1080px',
        loading:'eager'
    };
    return (
        <div className="page-container" style={pageStyle}>
            <span className="congratulation-text">You won!</span>
            <img className="won-player" src={"./images/object/Basketball_monopoly_finch_05.png"}/>
            <div className="button-container">
                <img onClick={()=>{navigateTo("start")}} src={"./images/object/Basketball_monopoly_home_button.png"}/>
                <img onClick={()=>{navigateTo("monopoly")}} src={"./images/object/Basketball_monopoly_again_button.png"}/>
            </div>
        </div>
    )
}

export default ScoresPage;